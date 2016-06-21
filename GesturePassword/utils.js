/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/20
 */
class utils {

  /**
   * 计算两点的长度
   * @param startX 起点x
   * @param startY 起点y
   * @param endX 结束点x
   * @param endY 结束点y
   */
  static calDistance(startX, startY, endX, endY) {
    let x = Math.pow(startX - endX, 2);
    let y = Math.pow(startY - endY, 2);
    return Math.sqrt(x + y);
  }

  static calTransform(startX, startY, endX, endY) {
    let distance = utils.calDistance(startX, startY, endX, endY);
    // 旋转角度
    let angle = Math.acos((endX - startX) / distance);

    if (startY > endY) {
      angle = 2 * Math.PI - angle;
    }

    let c1 = {
      x: startX + distance / 2,
      y: startY
    };
    let c2 = {
      x: (endX + startX) / 2,
      y: (endY + startY) / 2
    };
    let translateX = c2.x - c1.x;
    let translateY = c2.y - c1.y;

    return {
      distance,
      angle,
      translateX,
      translateY
    };

  }

}

export default utils;
