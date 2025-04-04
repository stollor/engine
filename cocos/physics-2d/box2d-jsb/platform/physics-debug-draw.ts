/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
import { JSB } from 'internal:constants';
import { Color, Vec2 } from '../../../core';
import { PHYSICS_2D_PTM_RATIO } from '../../framework';
import type { Graphics } from '../../../2d/components/graphics';
import { b2EmptyInstance } from '../empty-for-editor';

if (!JSB) {
    (globalThis as any).b2jsb = b2EmptyInstance;
}

const _tmp_vec2 = new b2jsb.Vec2();
const _tmp_color = new Color();

const GREEN_COLOR = Color.GREEN;
const RED_COLOR = Color.RED;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
b2jsb.Transform.MulXV = function (T, v, out): any {
    const T_q_c = T.q.c; const T_q_s = T.q.s;
    const v_x = v.x; const v_y = v.y;
    out.x = (T_q_c * v_x - T_q_s * v_y) + T.p.x;
    out.y = (T_q_s * v_x + T_q_c * v_y) + T.p.y;
    return out;
};
export class PhysicsDebugDraw extends b2jsb.Draw {
    _drawer: Graphics | null = null;

    _xf = new b2jsb.Transform();
    _dxf = new b2jsb.Transform();

    constructor (drawer: Graphics) {
        super();
        this._drawer = drawer;
    }

    _DrawPolygon (vertices, vertexCount): void {
        const drawer = this._drawer!;

        for (let i = 0; i < vertexCount; i++) {
            b2jsb.Transform.MulXV(this._xf, vertices[i] as Vec2, _tmp_vec2);
            const x = _tmp_vec2.x * PHYSICS_2D_PTM_RATIO;
            const y = _tmp_vec2.y * PHYSICS_2D_PTM_RATIO;
            if (i === 0) drawer.moveTo(x, y);
            else {
                drawer.lineTo(x, y);
            }
        }

        drawer.close();
    }

    DrawPolygon (vertices, vertexCount, color): void {
        this._applyStrokeColor(color);
        this._DrawPolygon(vertices, vertexCount);
        this._drawer!.stroke();
    }

    DrawSolidPolygon (vertices, vertexCount, color): void {
        this._applyFillColor(color);
        this._DrawPolygon(vertices, vertexCount);
        this._drawer!.fill();
        this._drawer!.stroke();
    }

    _DrawCircle (center: b2jsb.Vec2, radius: number): void {
        b2jsb.Transform.MulXV(this._xf, center, _tmp_vec2);
        //scale?
        this._drawer!.circle((_tmp_vec2.x) * PHYSICS_2D_PTM_RATIO, (_tmp_vec2.y) * PHYSICS_2D_PTM_RATIO, radius * PHYSICS_2D_PTM_RATIO);
    }

    DrawCircle (center: b2jsb.Vec2, radius: number, color): void {
        this._applyStrokeColor(color);
        this._DrawCircle(center, radius);
        this._drawer!.stroke();
    }

    DrawSolidCircle (center: b2jsb.Vec2, radius: number, axis, color): void {
        this._applyFillColor(color);
        this._DrawCircle(center, radius);
        this._drawer!.fill();
    }

    DrawSegment (p1: b2jsb.Vec2, p2: b2jsb.Vec2, color): void {
        const drawer = this._drawer!;

        if (p1.x === p2.x && p1.y === p2.y) {
            this._applyFillColor(color);
            this._DrawCircle(p1, 2 / PHYSICS_2D_PTM_RATIO);
            drawer.fill();
            return;
        }
        this._applyStrokeColor(color);

        b2jsb.Transform.MulXV(this._xf, p1, _tmp_vec2);
        drawer.moveTo(_tmp_vec2.x * PHYSICS_2D_PTM_RATIO, _tmp_vec2.y * PHYSICS_2D_PTM_RATIO);
        b2jsb.Transform.MulXV(this._xf, p2, _tmp_vec2);
        drawer.lineTo(_tmp_vec2.x * PHYSICS_2D_PTM_RATIO, _tmp_vec2.y * PHYSICS_2D_PTM_RATIO);
        drawer.stroke();
    }

    DrawTransform (xf: b2jsb.Transform): void {
        const drawer = this._drawer!;

        drawer.strokeColor = RED_COLOR;

        _tmp_vec2.x = _tmp_vec2.y = 0;
        b2jsb.Transform.MulXV(xf, _tmp_vec2, _tmp_vec2);
        drawer.moveTo(_tmp_vec2.x * PHYSICS_2D_PTM_RATIO, _tmp_vec2.y * PHYSICS_2D_PTM_RATIO);

        _tmp_vec2.x = 1; _tmp_vec2.y = 0;
        b2jsb.Transform.MulXV(xf, _tmp_vec2, _tmp_vec2);
        drawer.lineTo(_tmp_vec2.x * PHYSICS_2D_PTM_RATIO, _tmp_vec2.y * PHYSICS_2D_PTM_RATIO);

        drawer.stroke();

        drawer.strokeColor = GREEN_COLOR;

        _tmp_vec2.x = _tmp_vec2.y = 0;
        b2jsb.Transform.MulXV(xf, _tmp_vec2, _tmp_vec2);
        drawer.moveTo(_tmp_vec2.x * PHYSICS_2D_PTM_RATIO, _tmp_vec2.y * PHYSICS_2D_PTM_RATIO);

        _tmp_vec2.x = 0; _tmp_vec2.y = 1;
        b2jsb.Transform.MulXV(xf, _tmp_vec2, _tmp_vec2);
        drawer.lineTo(_tmp_vec2.x * PHYSICS_2D_PTM_RATIO, _tmp_vec2.y * PHYSICS_2D_PTM_RATIO);

        drawer.stroke();
    }

    DrawPoint (center, radius, color): void {
        //empty
    }

    DrawParticles (): void {
        //empty
    }

    _applyStrokeColor (color): void {
        this._drawer!.strokeColor = _tmp_color.set(
            color.r * 255,
            color.g * 255,
            color.b * 255,
            150,
        );
    }

    _applyFillColor (color): void {
        this._drawer!.fillColor = _tmp_color.set(
            color.r * 255,
            color.g * 255,
            color.b * 255,
            150,
        );
    }

    PushTransform (xf): void {
        this._xf = xf;
    }

    PopTransform (): void {
        this._xf = this._dxf;
    }
}
