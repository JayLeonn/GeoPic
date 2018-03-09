import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CoordinatesPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'coordinatesPipe',
})
export class CoordinatesPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(desc: string, type): any {
    // description goes like this: latitude | longitude | description

    if(type == 'lat') {
      var tmp = desc.split('|');
      return parseFloat(tmp[0]);
    } else if(type == 'lng') {
      var tmp = desc.split('|');
      return parseFloat(tmp[1]);
    } else if(type == 'desc') {
      var tmp = desc.split('|');
      return (tmp[2]);
    }
  }

}
