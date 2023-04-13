import { Module, forwardRef } from '@nestjs/common';
import { InstructionService } from './instruction.service';
import { InferenceModule } from 'src/inference/inference.module';
import { ToolModule } from 'src/tool/tool.module';

@Module({
  imports: [forwardRef(() => InferenceModule), ToolModule],
  providers: [InstructionService],
  exports: [InstructionService],
})
export class InstructionModule {}
