import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items || !items.length) return items;

    if (!searchText || !searchText.length) return items;

    return items.filter(item => {
      return item.name.toString().toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    });
  }

}
