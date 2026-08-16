#import <CoreGraphics/CoreGraphics.h>
#import <CoreText/CoreText.h>
#import <Foundation/Foundation.h>

typedef struct {
  __unsafe_unretained NSMutableString *data;
} SVGPathContext;

static void appendPoint(NSMutableString *data, NSString *command, CGPoint point) {
  [data appendFormat:@"%@%.3f %.3f", command, point.x, point.y];
}

static void appendPathElement(void *info, const CGPathElement *element) {
  SVGPathContext *context = (SVGPathContext *)info;
  NSMutableString *data = context->data;

  switch (element->type) {
    case kCGPathElementMoveToPoint:
      appendPoint(data, @"M", element->points[0]);
      break;
    case kCGPathElementAddLineToPoint:
      appendPoint(data, @"L", element->points[0]);
      break;
    case kCGPathElementAddQuadCurveToPoint:
      appendPoint(data, @"Q", element->points[0]);
      [data appendFormat:@" %.3f %.3f", element->points[1].x,
                         element->points[1].y];
      break;
    case kCGPathElementAddCurveToPoint:
      appendPoint(data, @"C", element->points[0]);
      [data appendFormat:@" %.3f %.3f %.3f %.3f", element->points[1].x,
                         element->points[1].y, element->points[2].x,
                         element->points[2].y];
      break;
    case kCGPathElementCloseSubpath:
      [data appendString:@"Z"];
      break;
  }
}

static void addOutlinedLine(CGMutablePathRef destination, NSString *text,
                            CTFontRef font, CGFloat baseline,
                            CGFloat tracking) {
  NSDictionary *attributes = @{
    (__bridge id)kCTFontAttributeName : (__bridge id)font,
    (__bridge id)kCTKernAttributeName : @(tracking),
  };
  NSAttributedString *attributed =
      [[NSAttributedString alloc] initWithString:text attributes:attributes];
  CTLineRef line = CTLineCreateWithAttributedString(
      (__bridge CFAttributedStringRef)attributed);

  for (id runObject in (__bridge NSArray *)CTLineGetGlyphRuns(line)) {
    CTRunRef run = (__bridge CTRunRef)runObject;
    CFIndex glyphCount = CTRunGetGlyphCount(run);
    CGGlyph *glyphs = calloc((size_t)glyphCount, sizeof(CGGlyph));
    CGPoint *positions = calloc((size_t)glyphCount, sizeof(CGPoint));
    CTRunGetGlyphs(run, CFRangeMake(0, 0), glyphs);
    CTRunGetPositions(run, CFRangeMake(0, 0), positions);

    for (CFIndex index = 0; index < glyphCount; index += 1) {
      CGPathRef glyphPath = CTFontCreatePathForGlyph(font, glyphs[index], NULL);
      if (glyphPath == NULL) continue;

      CGAffineTransform transform = CGAffineTransformMake(
          1, 0, 0, -1, positions[index].x, baseline - positions[index].y);
      CGPathRef positioned =
          CGPathCreateCopyByTransformingPath(glyphPath, &transform);
      CGPathAddPath(destination, NULL, positioned);
      CGPathRelease(positioned);
      CGPathRelease(glyphPath);
    }

    free(glyphs);
    free(positions);
  }

  CFRelease(line);
}

int main(int argc, const char *argv[]) {
  @autoreleasepool {
    if (argc != 3) {
      fprintf(stderr, "Usage: generate-contact-gold-svg FONT.ttf OUTPUT.svg\n");
      return 64;
    }

    NSString *fontPath = [NSString stringWithUTF8String:argv[1]];
    NSString *outputPath = [NSString stringWithUTF8String:argv[2]];
    CGDataProviderRef provider =
        CGDataProviderCreateWithFilename(fontPath.fileSystemRepresentation);
    if (provider == NULL) {
      fprintf(stderr, "Unable to open font file.\n");
      return 1;
    }

    CGFontRef baseFont = CGFontCreateWithDataProvider(provider);
    CGDataProviderRelease(provider);
    if (baseFont == NULL) {
      fprintf(stderr, "Unable to load font.\n");
      return 1;
    }

    NSMutableDictionary *variations = [NSMutableDictionary dictionary];
    CFArrayRef axes = CGFontCopyVariationAxes(baseFont);
    for (NSDictionary *axis in (__bridge NSArray *)axes) {
      NSString *name = axis[(__bridge NSString *)kCGFontVariationAxisName];
      if ([name localizedCaseInsensitiveContainsString:@"weight"]) {
        variations[name] = @500;
      }
    }

    CGFontRef mediumFont = variations.count > 0
        ? CGFontCreateCopyWithVariations(
              baseFont, (__bridge CFDictionaryRef)variations)
        : CGFontRetain(baseFont);
    if (axes != NULL) CFRelease(axes);
    CGFontRelease(baseFont);

    CTFontRef font = CTFontCreateWithGraphicsFont(mediumFont, 100, NULL, NULL);
    CGFontRelease(mediumFont);

    CGMutablePathRef combined = CGPathCreateMutable();
    addOutlinedLine(combined, @"(000) 000-0000", font, 0, 2.0);
    addOutlinedLine(combined, @"SHELTONLINEN.COM", font, 126, 2.0);
    CFRelease(font);

    CGRect bounds = CGPathGetBoundingBox(combined);
    CGFloat padding = 8;
    CGAffineTransform shift = CGAffineTransformMakeTranslation(
        padding - bounds.origin.x, padding - bounds.origin.y);
    CGPathRef shifted = CGPathCreateCopyByTransformingPath(combined, &shift);
    CGPathRelease(combined);

    NSMutableString *pathData = [NSMutableString string];
    SVGPathContext pathContext = {.data = pathData};
    CGPathApply(shifted, &pathContext, appendPathElement);
    CGPathRelease(shifted);

    CGFloat width = ceil(bounds.size.width + padding * 2);
    CGFloat height = ceil(bounds.size.height + padding * 2);
    NSString *svg = [NSString stringWithFormat:
        @"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 %.0f %.0f\" "
         "width=\"%.0f\" height=\"%.0f\" role=\"img\" aria-labelledby=\"title desc\">\n"
         "  <title id=\"title\">Shelton gold phone and website contact lockup</title>\n"
         "  <desc id=\"desc\">Inter Medium lettering converted to vector outlines: "
         "(000) 000-0000 and SHELTONLINEN.COM.</desc>\n"
         "  <metadata>Inter Medium 500; outlined vector text; fill #B8965A; "
         "transparent background.</metadata>\n"
         "  <path fill=\"#B8965A\" d=\"%@\"/>\n"
         "</svg>\n",
        width, height, width, height, pathData];

    NSError *error = nil;
    BOOL success = [svg writeToFile:outputPath
                         atomically:YES
                           encoding:NSUTF8StringEncoding
                              error:&error];
    if (!success) {
      fprintf(stderr, "Unable to write SVG: %s\n",
              error.localizedDescription.UTF8String);
      return 1;
    }

    printf("%s | %.0f x %.0f | Inter Medium outlines | #B8965A\n",
           argv[2], width, height);
  }

  return 0;
}
