#import <CoreImage/CoreImage.h>
#import <Foundation/Foundation.h>
#import <ImageIO/ImageIO.h>

int main(int argc, const char *argv[]) {
  @autoreleasepool {
    if (argc != 2) {
      fprintf(stderr, "Usage: generate-sheltonlinen-qr OUTPUT.png\n");
      return 64;
    }

    NSString *payload = @"https://sheltonlinen.com";
    NSData *message = [payload dataUsingEncoding:NSUTF8StringEncoding];
    CIFilter *generator = [CIFilter filterWithName:@"CIQRCodeGenerator"];
    [generator setValue:message forKey:@"inputMessage"];
    [generator setValue:@"M" forKey:@"inputCorrectionLevel"];

    CIImage *matrix = generator.outputImage;
    if (matrix == nil) {
      fprintf(stderr, "Unable to generate QR matrix.\n");
      return 1;
    }

    CGFloat moduleScale = 10.0;
    CIImage *scaled = [matrix imageByApplyingTransform:
        CGAffineTransformMakeScale(moduleScale, moduleScale)];

    CIFilter *colorizer = [CIFilter filterWithName:@"CIFalseColor"];
    [colorizer setValue:scaled forKey:kCIInputImageKey];
    [colorizer setValue:[CIColor colorWithRed:8.0 / 255.0
                                        green:19.0 / 255.0
                                         blue:33.0 / 255.0]
                  forKey:@"inputColor0"];
    [colorizer setValue:[CIColor colorWithRed:1.0 green:1.0 blue:1.0]
                  forKey:@"inputColor1"];

    CIImage *colored = colorizer.outputImage;
    CGFloat quietZone = moduleScale * 4.0;
    CGRect finalExtent = CGRectMake(
        0, 0, colored.extent.size.width + quietZone * 2.0,
        colored.extent.size.height + quietZone * 2.0);
    CIImage *white = [[CIImage imageWithColor:
        [CIColor colorWithRed:1.0 green:1.0 blue:1.0]]
        imageByCroppingToRect:finalExtent];
    CIImage *withQuietZone = [[colored imageByApplyingTransform:
        CGAffineTransformMakeTranslation(quietZone, quietZone)]
        imageByCompositingOverImage:white];
    CIContext *context = [CIContext contextWithOptions:nil];
    CGImageRef image = [context createCGImage:withQuietZone fromRect:finalExtent];
    if (image == nil) {
      fprintf(stderr, "Unable to render QR image.\n");
      return 1;
    }

    NSString *outputPath = [NSString stringWithUTF8String:argv[1]];
    NSURL *outputUrl = [NSURL fileURLWithPath:outputPath];
    CGImageDestinationRef destination = CGImageDestinationCreateWithURL(
        (__bridge CFURLRef)outputUrl, CFSTR("public.png"), 1, NULL);
    if (destination == NULL) {
      CGImageRelease(image);
      fprintf(stderr, "Unable to create PNG destination.\n");
      return 1;
    }

    CGImageDestinationAddImage(destination, image, NULL);
    BOOL success = CGImageDestinationFinalize(destination);
    CFRelease(destination);
    CGImageRelease(image);

    if (!success) {
      fprintf(stderr, "Unable to write PNG.\n");
      return 1;
    }

    printf("%s | generated %s | %.0fx%.0f matrix\n", argv[1],
           payload.UTF8String, matrix.extent.size.width,
           matrix.extent.size.height);
  }

  return 0;
}
