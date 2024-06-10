import { get, ResponseSchema } from './api';
import { Image } from '../types/Image.types';

function imageList(): Promise<ResponseSchema<Image>> {
  return get<ResponseSchema<Image>>('photos');
}

export { imageList };
