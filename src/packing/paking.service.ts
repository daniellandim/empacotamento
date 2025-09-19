import { Injectable } from '@nestjs/common';
import { BOXES, BoxDef } from '../common/boxes';
import { ProductDto } from './dto/product.dto';

// Interfaces para tipagem correta
export interface OpenBox {
  id: string; // Caixa 1,2,3 ou UNPACKABLE
  height: number;
  width: number;
  length: number;
  remainingVolume: number;
  productIds: string[];
}

export interface PackedBox {
  boxId: string;
  height: number;
  width: number;
  length: number;
  remainingVolume: number;
  productIds: string[];
}

export interface PackingResult {
  orderId: string;
  boxes: PackedBox[];
}

@Injectable()
export class PackingService {
  private boxesDefs: BoxDef[] = BOXES;

  // Gera permutações de dimensões para verificar se produto cabe
  private orientations(h: number, w: number, l: number): [number, number, number][] {
    const arr = [
      [h, w, l],
      [h, l, w],
      [w, h, l],
      [w, l, h],
      [l, h, w],
      [l, w, h],
    ];
    // Remove duplicados caso dimensões iguais
    return Array.from(new Set(arr.map(a => a.join('x')))).map(
      s => s.split('x').map(Number) as [number, number, number],
    );
  }

  private fitsInBox(product: ProductDto, box: BoxDef): boolean {
    const orients = this.orientations(product.height, product.width, product.length);
    return orients.some(([ph, pw, pl]) => ph <= box.height && pw <= box.width && pl <= box.length);
  }

  async packOrders(
    orders: { orderId: string; products: ProductDto[] }[],
  ): Promise<PackingResult[]> {
    const results: PackingResult[] = [];

    // Ordena caixas por volume crescente para abrir a menor caixa possível
    const boxesBySmallFirst = [...this.boxesDefs].sort((a, b) => a.volume - b.volume);

    for (const order of orders) {
      // Adiciona volume a cada produto
      const prods = order.products.map(p => ({ ...p, volume: p.height * p.width * p.length }));
      // Ordena produtos do maior para o menor volume
      prods.sort((a, b) => b.volume - a.volume);

      const openBoxes: OpenBox[] = [];

      for (const p of prods) {
        let placed = false;

        // Tenta colocar em caixa aberta
        const candidates = openBoxes
          .filter(ob => ob.remainingVolume >= p.volume)
          .filter(ob =>
            this.orientations(p.height, p.width, p.length).some(
              ([ph, pw, pl]) => ph <= ob.height && pw <= ob.width && pl <= ob.length,
            ),
          )
          .sort((a, b) => a.remainingVolume - b.remainingVolume);

        if (candidates.length) {
          const box = candidates[0];
          box.productIds.push(p.id);
          box.remainingVolume -= p.volume;
          placed = true;
        }

        if (!placed) {
          // Abrir nova caixa: menor caixa que comporta produto
          const possibleBoxes = boxesBySmallFirst.filter(b => this.fitsInBox(p, b));

          if (!possibleBoxes.length) {
            // Produto não cabe em nenhuma caixa disponível
            openBoxes.push({
              id: 'UNPACKABLE',
              height: p.height,
              width: p.width,
              length: p.length,
              remainingVolume: 0,
              productIds: [p.id],
            });
            continue;
          }

          const chosen = possibleBoxes[0];
          openBoxes.push({
            id: chosen.id,
            height: chosen.height,
            width: chosen.width,
            length: chosen.length,
            remainingVolume: chosen.volume - p.volume,
            productIds: [p.id],
          });
        }
      }

      // Formata resultado para o pedido
      const boxesResult: PackedBox[] = openBoxes.map(b => ({
        boxId: b.id,
        height: b.height,
        width: b.width,
        length: b.length,
        remainingVolume: b.remainingVolume,
        productIds: b.productIds,
      }));

      results.push({
        orderId: order.orderId,
        boxes: boxesResult,
      });
    }

    return results;
  }
}
