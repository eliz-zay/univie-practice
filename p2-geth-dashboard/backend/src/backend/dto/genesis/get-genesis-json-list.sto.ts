import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class GetGenesisJsonListDto {
    @ApiProperty()
    @Transform((v) => v.value === 'true')
    @IsBoolean()
    availableDirsOnly: boolean;
}
