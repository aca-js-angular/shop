import { Injectable } from '@angular/core';
import { Config } from '../../interfaces and constructors/config.Interface';
import { DecodedConfig } from '../../interfaces and constructors/decoded-config.Interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigDecoderService {

  /* --- Methods --- */

  decodeConfig(config: Config): DecodedConfig{

    let width = 80 / config.ratio + '%';
    let margin = 20 / config.ratio / 2 + '%';
    let marginBottom = 20 / config.ratio + 'px'

    const positioning = {width, margin, 'margin-bottom': marginBottom}
    const info = config.info;
    const likeable = config.likeable;

    return {positioning,info,likeable}
  }

}
