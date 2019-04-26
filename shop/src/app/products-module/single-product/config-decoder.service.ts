import { Injectable } from '@angular/core';
import { Config } from './configInterface';
import { DecodedConfig } from './decodedConfigInterface';

@Injectable({
  providedIn: 'root'
})
export class ConfigDecoderService {

  constructor() { }

  decodeConfig(config: Config): DecodedConfig{

    let width = 80 / config.ratio + '%';
    let margin = 20 / config.ratio / 2 + '%';
    let marginBottom = 20 / config.ratio + 'px'

    const positioning = {width, margin, 'margin-bottom': marginBottom}
    const info = config.info;
    const likeable = config.likeable;
    const full = config.full;
    const noMargin = config.noMargin;

    return {positioning,info,likeable,full,noMargin}
  }

}
