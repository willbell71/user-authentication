import { Pipe, PipeTransform } from '@angular/core';

/**
 * Unavailable pipe, outputs 'unavailable' when there is no value to display.
 */
@Pipe({
  name: 'unavailable'
})
export class UnavailablePipe implements PipeTransform {
  /**
   * Displays the value, or 'unavailable' if there is no value
   * @param {string} value - value to display.
   */
  public transform(value: string): string {
    return value ? value : 'unavailable';
  }

}
