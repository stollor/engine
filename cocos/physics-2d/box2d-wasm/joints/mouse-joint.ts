/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { B2 } from '../instantiated';
import { IMouseJoint } from '../../spec/i-physics-joint';
import { B2Joint } from './joint-2d';
import { MouseJoint2D, PhysicsSystem2D, Joint2D } from '../../framework';
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';
import { IVec2Like, Vec2 } from '../../../core';
import { Touch } from '../../../input/types';
import { B2PhysicsWorld } from '../physics-world';
import { NodeEventType } from '../../../scene-graph/node-event';
import { find } from '../../../scene-graph';

const tempB2Vec2 = { x: 0, y: 0 };//new b2.Vec2();

/** @mangle */
export class B2MouseJoint extends B2Joint implements IMouseJoint {
    _touchPoint = new Vec2();
    _isTouched = false;

    setTarget (v: IVec2Like): void {
        if (this._b2joint) {
            tempB2Vec2.x = v.x / PHYSICS_2D_PTM_RATIO;
            tempB2Vec2.y = v.y / PHYSICS_2D_PTM_RATIO;
            (this._b2joint as B2.MouseJoint).SetTarget(tempB2Vec2);
        }
    }
    setFrequency (v: number): void {
        if (this._b2joint) {
            (this._b2joint as B2.MouseJoint).SetFrequency(v);
        }
    }
    setDampingRatio (v: number): void {
        if (this._b2joint) {
            (this._b2joint as B2.MouseJoint).SetDampingRatio(v);
        }
    }
    setMaxForce (v: number): void {
        if (this._b2joint) {
            (this._b2joint as B2.MouseJoint).SetMaxForce(v);
        }
    }

    override _createJointDef (): any {
        const def = new B2.MouseJointDef();
        const comp = this._jointComp as MouseJoint2D;
        def.target = { x: this._touchPoint.x / PHYSICS_2D_PTM_RATIO, y: this._touchPoint.y / PHYSICS_2D_PTM_RATIO };
        def.maxForce = comp.maxForce;
        def.dampingRatio = comp.dampingRatio;
        def.frequencyHz = comp.frequency;
        return def;
    }

    override start (): void {
        // empty implementation to override its parent's start, so don't remove it.
    }

    override onEnable (): void {
        this._enableTouch(true);
    }

    override onDisable (): void {
        super.onDisable();
        this._enableTouch(false);
    }

    private _enableTouch (v: boolean): void {
        const canvas = find('Canvas');
        if (canvas) {
            const cb = v ? canvas.on : canvas.off;
            cb.call(canvas, NodeEventType.TOUCH_START, this.onTouchBegan, this);
            cb.call(canvas, NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
            cb.call(canvas, NodeEventType.TOUCH_END, this.onTouchEnd, this);
            cb.call(canvas, NodeEventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
    }

    onTouchBegan (event: Touch): void {
        this._isTouched = true;

        const target = this._touchPoint.set(event.getUILocation());

        const world = (PhysicsSystem2D.instance.physicsWorld as B2PhysicsWorld);
        const colliders = world.testPoint(target);
        if (colliders.length <= 0) return;

        const body = colliders[0].body;
        body!.wakeUp();

        const comp = this._jointComp as MouseJoint2D;
        comp.connectedBody = body;

        this._init();

        this.setMaxForce(comp.maxForce * body!.getMass());
        this.setTarget(target);
    }

    onTouchMove (event: Touch): void {
        this._touchPoint = event.getUILocation();
    }

    onTouchEnd (event: Touch): void {
        this.destroy();
        this._isTouched = false;
    }

    update (): void {
        if (!this._isTouched || !this.isValid()) {
            return;
        }

        // let camera = cc.Camera.findCamera(this.node);
        // if (camera) {
        //     this.target = camera.getScreenToWorldPoint(this._touchPoint);
        // }
        // else {
        this.setTarget(this._touchPoint);
        // }
    }
}
