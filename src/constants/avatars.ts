/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import head1Img from '../data/head1.PNG';
import head2Img from '../data/head2.PNG';
import head3Img from '../data/head3.PNG';
import clothes1Img from '../data/clothes1.PNG';
import clothes2Img from '../data/clothes2.PNG';
import clothes3Img from '../data/clothes3.PNG';

export type HeadId = 'head1' | 'head2' | 'head3';
export type ClothesId = 'clothes1' | 'clothes2' | 'clothes3';

export const HEAD_IMAGES: Record<HeadId, string> = {
  head1: head1Img,
  head2: head2Img,
  head3: head3Img,
};

export const CLOTHES_IMAGES: Record<ClothesId, string> = {
  clothes1: clothes1Img,
  clothes2: clothes2Img,
  clothes3: clothes3Img,
};

export const HEADS: HeadId[] = ['head1', 'head2', 'head3'];
export const CLOTHES: ClothesId[] = ['clothes1', 'clothes2', 'clothes3'];
