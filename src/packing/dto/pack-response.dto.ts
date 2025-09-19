import { ApiProperty } from '@nestjs/swagger';

class PackedBox {
  @ApiProperty()
  boxId: string;

  @ApiProperty()
  height: number;

  @ApiProperty()
  width: number;

  @ApiProperty()
  length: number;

  @ApiProperty()
  remainingVolume: number;

  @ApiProperty({ type: [String] })
  productIds: string[];
}

export class OrderPackingResult {
  @ApiProperty()
  orderId: string;

  @ApiProperty({ type: [PackedBox] })
  boxes: PackedBox[];
}

export class PackResponseDto {
  @ApiProperty({ type: [OrderPackingResult] })
  results: OrderPackingResult[];
}
