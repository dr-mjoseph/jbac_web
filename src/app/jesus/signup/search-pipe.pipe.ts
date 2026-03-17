import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipePipe implements PipeTransform {

 transform(items: any[], searchText: string): any[] {
   //return empty array if empty array is passed
    if(!items) return [];
    //if no search text return empty items
    if(!searchText) return items;
    //convert all searchtext into lowercase
searchText = searchText.toLowerCase();
//filter items and check for search text with includes
return items.filter( it => {
      return it.toLowerCase().includes(searchText);
    });
  }

}