class Vec3 {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  add(o) {
    return new Vec3(this.x + o.x, this.y + o.y, this.z + o.z)
  }
  sub(o) {
    return new Vec3(this.x - o.x, this.y - o.y, this.z - o.z)
  }
  scale(k) {
    return new Vec3(this.x * k, this.y * k, this.z * k)
  }

  dot(o) {
    return this.x * o.x + this.y * o.y + z * o.z
  }

  cross(o) {
    return new Vec3(
      this.y * o.z - this.z * o.y,
      this.z * o.x - this.x * o.z,
      this.x * o.y - this.y * o.x
    )
  }

  lengthSquared() { return this.x * this.x + this.y * this.y + this.z * this.z }
  length() { return Math.sqrt(this.lengthSquared()) }
  normed() {
    const l2 = this.lengthSquared()
    return l2 === 0 ? new Vec3(0, 0, 0) : this.scale(1 / Math.sqrt(l2))
  }
}

class Vec4 {
  constructor(x, y, z, w) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }
  add(o) {
    return new Vec3(this.x + o.x, this.y + o.y, this.z + o.z, this.w + o.w)
  }
  sub(o) {
    return new Vec3(this.x - o.x, this.y - o.y, this.z - o.z, this.w - o.w)
  }
  scale(k) {
    return new Vec3(this.x * k, this.y * k, this.z * k, this.w * k)
  }

  dot(o) {
    return this.x * o.x + this.y * o.y + this.z * o.z + this.w * o.w
  }

  lengthSquared() { return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w }
  length() { return Math.sqrt(this.lengthSquared()) }
  normed() {
    const l2 = this.lengthSquared()
    return l2 === 0 ? new Vec4(0, 0, 0, 0) : this.scale(1 / Math.sqrt(l2))
  }
}

/** 4x4 Matrix
  * ( a  b  c  d )
  * ( e  f  g  h )
  * ( i  j  k  l )
  * ( m  n  o  p )
  */
class Mat44 {
  constructor(
    a, b, c, d,
    e, f, g, h,
    i, j, k, l,
    m, n, o, p
  ) {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
    this.e = e
    this.f = f
    this.g = g
    this.h = h
    this.i = i
    this.j = j
    this.k = k
    this.l = l
    this.m = m
    this.n = n
    this.o = o
    this.p = p
  }
  mul(o) {
    if (o instanceof Mat44) {
      return new Mat44(
        this.a * o.a + this.b * o.e + this.c * o.i + this.d * o.m, this.a * o.b + this.b * o.f + this.c * o.j + this.d * o.n, this.a * o.c + this.b * o.g + this.c * o.k + this.d * o.o, this.a * o.d + this.b * o.h + this.c * o.l + this.d * o.p,
        this.e * o.a + this.f * o.e + this.g * o.i + this.h * o.m, this.e * o.b + this.f * o.f + this.g * o.j + this.h * o.n, this.e * o.c + this.f * o.g + this.g * o.k + this.h * o.o, this.e * o.d + this.f * o.h + this.g * o.l + this.h * o.p,
        this.i * o.a + this.j * o.e + this.k * o.i + this.l * o.m, this.i * o.b + this.j * o.f + this.k * o.j + this.l * o.n, this.i * o.c + this.j * o.g + this.k * o.k + this.l * o.o, this.i * o.d + this.j * o.h + this.k * o.l + this.l * o.p,
        this.m * o.a + this.n * o.e + this.o * o.i + this.p * o.m, this.m * o.b + this.n * o.f + this.o * o.j + this.p * o.n, this.m * o.c + this.n * o.g + this.o * o.k + this.p * o.o, this.m * o.d + this.n * o.h + this.o * o.l + this.p * o.p
      )
    } else if (o instanceof Vec4) {
      return new Vec4(
        this.a * o.x + this.b * o.y + this.c * o.z + this.d * o.w,
        this.e * o.x + this.f * o.y + this.g * o.z + this.h * o.w,
        this.i * o.x + this.j * o.y + this.k * o.z + this.l * o.w,
        this.m * o.x + this.n * o.y + this.o * o.z + this.p * o.w
      )
    } else if (o instanceof Vec3) {
      const v4 = this.mul(new Vec4(o.x, o.y, o.z, 1))
      return new Vec3(v4.x / v4.w, v4.y / v4.w, v4.z / v4.w)
    } else if (typeof o === 'number') {
      return new Mat44(
        this.a * o, this.b * o, this.c * o, this.d * o,
        this.e * o, this.f * o, this.g * o, this.h * o,
        this.i * o, this.j * o, this.k * o, this.l * o,
        this.m * o, this.n * o, this.o * o, this.p * o
      )
    }
  }

  static identity() {
    return new Mat44(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    )
  }
  static rotate(xp, yp, zp, a) {
    const c = Math.cos(a)
    const s = Math.sin(a)
    const {x, y, z} = new Vec3(xp, yp, zp).normed()
    return new Mat44(
      x*x*(1-c)+c, x*y*(1-c)-z*s, x*z*(1-c)+y*s, 0,
      y*x*(1-c)+z*s, y*y*(1-c)+c, y*z*(1-c)-x*s, 0,
      x*z*(1-c)-y*s, y*z*(1-c)+x*s, z*z*(1-c)+c, 0,
      0, 0, 0, 1
    )
  }
  static translate(tx, ty, tz) {
    return new Mat44(
      1, 0, 0, tx,
      0, 1, 0, ty,
      0, 0, 1, tz,
      0, 0, 0, 1
    )
  }
  static scale(x, y, z) {
    return new Mat44(
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    )
  }
  static perspective(fovRad, aspect, near, far) {
    const fov = 1 / Math.tan(fovRad / 2)
    return new Mat44(
      fov / aspect, 0, 0, 0,
      0, fov, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far), 0)
  }
}

module.exports = {
  Mat44,
  Vec3,
  Vec4,
}
