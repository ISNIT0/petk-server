import { Module } from '@nestjs/common';
import { PiiDetectorService } from './pii-detector.service';

@Module({
  providers: [PiiDetectorService],
  exports: [PiiDetectorService],
})
export class PiiDetectorModule {}
