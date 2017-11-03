/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
export interface OrientationType {
  auto: number,
  landscapeLeft: number,
  landscapeRight: number,
  portrait: number,
  portraitUpsideDown: number
}

export interface QualityType {
  high: string,
  medium: string,
  low: string,
  vga: string,
  hd720: string,
  hd1080: string,
  photo: string
}

export default interface Props {
  onCaptureOutputBuffer?: (buffer: string) => void;
}
