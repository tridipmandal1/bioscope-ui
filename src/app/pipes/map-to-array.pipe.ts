import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToArray',
  standalone: true
})
export class MapToArrayPipe implements PipeTransform {

  transform(value: Map<string, number> | undefined): { category: string, price: number }[] {
    if (!value) return [];
    const result: { category: string, price: number }[] = [];
    value.forEach((price, category) => {
      result.push({ category, price });
    });
    return result;
  }

}
