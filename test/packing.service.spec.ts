import { Test, TestingModule } from '@nestjs/testing';
import { PackingService } from '../src/packing/paking.service';

describe('PackingService', () => {
  let service: PackingService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackingService],
    }).compile();

    service = module.get<PackingService>(PackingService);
  });

  it('should pack simple order', async () => {
    const orders = [{
      orderId: 'o1',
      products: [
        { id: 'p1', height: 10, width: 10, length: 10 },
        { id: 'p2', height: 20, width: 20, length: 20 },
      ],
    }];

    const res = await service.packOrders(orders as any);
    expect(res).toHaveLength(1);
    expect(res[0].boxes.length).toBeGreaterThanOrEqual(1);
    // produtos devem estar alocados
    const allProducts = res[0].boxes.flatMap(b => b.productIds);
    expect(allProducts).toContain('p1');
    expect(allProducts).toContain('p2');
  });
});
