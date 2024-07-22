import { BadRequestException } from '@nestjs/common';

export const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export function validateObjectId(id: string): void {
    if (!id.match(objectIdRegex)) {
        throw new BadRequestException('Invalid id');
    }
}
