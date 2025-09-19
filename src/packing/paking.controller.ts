import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PackRequestDto } from './dto/pack-request.dto';
import { PackResponseDto } from './dto/pack-response.dto';
import { PackingService } from './paking.service';

@ApiTags('packing')
@Controller('packing')
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  @Post()
  @ApiOperation({ summary: 'Recebe pedidos e retorna caixas com produtos' })
  async pack(@Body() body: PackRequestDto): Promise<PackResponseDto> {
    const results = await this.packingService.packOrders(body.orders);
    return { results };
  }
}
