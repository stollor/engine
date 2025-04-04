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

import { GamepadCallback } from 'pal/input';
import { InputEventType } from '../../../cocos/input/types/event-enum';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { InputSourceButton, InputSourceDpad, InputSourceOrientation, InputSourcePosition, InputSourceStick } from '../input-source';
import { Quat, Vec3 } from '../../../cocos/core';

export class GamepadInputDevice {
    public static all: GamepadInputDevice[] = [];
    public static xr: (GamepadInputDevice | null) = null;

    public get buttonNorth (): InputSourceButton { return this._buttonNorth; }
    public get buttonEast (): InputSourceButton { return this._buttonEast; }
    public get buttonWest (): InputSourceButton { return this._buttonWest; }
    public get buttonSouth (): InputSourceButton { return this._buttonSouth; }
    public get buttonL1 (): InputSourceButton { return this._buttonL1; }
    public get buttonL2 (): InputSourceButton { return this._buttonL2; }
    public get buttonL3 (): InputSourceButton { return this._buttonL3; }
    public get buttonR1 (): InputSourceButton { return this._buttonR1; }
    public get buttonR2 (): InputSourceButton { return this._buttonR2; }
    public get buttonR3 (): InputSourceButton { return this._buttonR3; }
    // public get buttonTouchPad () { return this._buttonTouchPad; }
    // public get buttonHome () { return this._buttonHome; }
    public get buttonShare (): InputSourceButton { return this._buttonShare; }
    public get buttonOptions (): InputSourceButton { return this._buttonOptions; }
    public get dpad (): InputSourceDpad { return this._dpad; }
    public get leftStick (): InputSourceStick { return this._leftStick; }
    public get rightStick (): InputSourceStick { return this._rightStick; }
    public get buttonStart (): InputSourceButton { return this._buttonStart; }
    public get gripLeft (): InputSourceButton { return this._gripLeft; }
    public get gripRight (): InputSourceButton { return this._gripRight; }
    public get handLeftPosition (): InputSourcePosition { return this._handLeftPosition; }
    public get handLeftOrientation (): InputSourceOrientation { return this._handLeftOrientation; }
    public get handRightPosition (): InputSourcePosition { return this._handRightPosition; }
    public get handRightOrientation (): InputSourceOrientation { return this._handRightOrientation; }
    public get aimLeftPosition (): InputSourcePosition { return this._aimLeftPosition; }
    public get aimLeftOrientation (): InputSourceOrientation { return this._aimLeftOrientation; }
    public get aimRightPosition (): InputSourcePosition { return this._aimRightPosition; }
    public get aimRightOrientation (): InputSourceOrientation { return this._aimRightOrientation; }

    public get deviceId (): number {
        return this._deviceId;
    }
    public get connected (): boolean {
        return this._connected;
    }

    private static _eventTarget: EventTarget = new EventTarget();

    private declare _buttonNorth: InputSourceButton;
    private declare _buttonEast: InputSourceButton;
    private declare _buttonWest: InputSourceButton;
    private declare _buttonSouth: InputSourceButton;
    private declare _buttonL1: InputSourceButton;
    private declare _buttonL2: InputSourceButton;
    private declare _buttonL3: InputSourceButton;
    private declare _buttonR1: InputSourceButton;
    private declare _buttonR2: InputSourceButton;
    private declare _buttonR3: InputSourceButton;
    // private declare buttonTouchPad: InputSourceButton;
    // private declare buttonHome: InputSourceButton;
    private declare _buttonShare: InputSourceButton;
    private declare _buttonOptions: InputSourceButton;
    private declare _dpad: InputSourceDpad;
    private declare _leftStick: InputSourceStick;
    private declare _rightStick: InputSourceStick;
    private declare _buttonStart: InputSourceButton;
    private declare _gripLeft: InputSourceButton;
    private declare _gripRight: InputSourceButton;
    private declare _handLeftPosition: InputSourcePosition;
    private declare _handLeftOrientation: InputSourceOrientation;
    private declare _handRightPosition: InputSourcePosition;
    private declare _handRightOrientation: InputSourceOrientation;
    private declare _aimLeftPosition: InputSourcePosition;
    private declare _aimLeftOrientation: InputSourceOrientation;
    private declare _aimRightPosition: InputSourcePosition;
    private declare _aimRightOrientation: InputSourceOrientation;

    private _deviceId = -1;
    private _connected = false;

    constructor (deviceId: number) {
        this._deviceId = deviceId;
        this._initInputSource();
    }

    /**
     * @engineInternal
     */
    public static _init (): void {
        // not supported
    }

    /**
     * @engineInternal
     */
    public static _on (eventType: InputEventType, cb: GamepadCallback, target?: any): void {
        GamepadInputDevice._eventTarget.on(eventType, cb, target);
    }

    private _initInputSource (): void {
        const self = this;
        self._buttonNorth = new InputSourceButton();
        self._buttonNorth.getValue = (): number => 0;
        self._buttonEast = new InputSourceButton();
        self._buttonEast.getValue = (): number => 0;
        self._buttonWest = new InputSourceButton();
        self._buttonWest.getValue = (): number => 0;
        self._buttonSouth = new InputSourceButton();
        self._buttonSouth.getValue = (): number => 0;

        self._buttonL1 = new InputSourceButton();
        self._buttonL1.getValue = (): number => 0;
        self._buttonL2 = new InputSourceButton();
        self._buttonL2.getValue = (): number => 0;
        self._buttonL3 = new InputSourceButton();
        self._buttonL3.getValue = (): number => 0;
        self._buttonR1 = new InputSourceButton();
        self._buttonR1.getValue = (): number => 0;
        self._buttonR2 = new InputSourceButton();
        self._buttonR2.getValue = (): number => 0;
        self._buttonR3 = new InputSourceButton();
        self._buttonR3.getValue = (): number => 0;

        // self._buttonTouchPad = new InputSourceButton();
        // self._buttonTouchPad.getValue = () => 0;
        // self._buttonHome = new InputSourceButton();
        // self._buttonHome.getValue = () => 0;

        self._buttonShare = new InputSourceButton();
        self._buttonShare.getValue = (): number => 0;
        self._buttonOptions = new InputSourceButton();
        self._buttonOptions.getValue = (): number => 0;

        const dpadUp = new InputSourceButton();
        dpadUp.getValue = (): number => 0;
        const dpadDown = new InputSourceButton();
        dpadDown.getValue = (): number => 0;
        const dpadLeft = new InputSourceButton();
        dpadLeft.getValue = (): number => 0;
        const dpadRight = new InputSourceButton();
        dpadRight.getValue = (): number => 0;
        self._dpad = new InputSourceDpad({ up: dpadUp, down: dpadDown, left: dpadLeft, right: dpadRight });

        const leftStickUp = new InputSourceButton();
        leftStickUp.getValue = (): number => 0;
        const leftStickDown = new InputSourceButton();
        leftStickDown.getValue = (): number => 0;
        const leftStickLeft = new InputSourceButton();
        leftStickLeft.getValue = (): number => 0;
        const leftStickRight = new InputSourceButton();
        leftStickRight.getValue = (): number => 0;
        self._leftStick = new InputSourceStick({ up: leftStickUp, down: leftStickDown, left: leftStickLeft, right: leftStickRight });

        const rightStickUp = new InputSourceButton();
        rightStickUp.getValue = (): number => 0;
        const rightStickDown = new InputSourceButton();
        rightStickDown.getValue = (): number => 0;
        const rightStickLeft = new InputSourceButton();
        rightStickLeft.getValue = (): number => 0;
        const rightStickRight = new InputSourceButton();
        rightStickRight.getValue = (): number => 0;
        self._rightStick = new InputSourceStick({ up: rightStickUp, down: rightStickDown, left: rightStickLeft, right: rightStickRight });

        self._buttonStart = new InputSourceButton();
        self._buttonStart.getValue = (): number => 0;

        self._gripLeft = new InputSourceButton();
        self._gripLeft.getValue = (): number => 0;
        self._gripRight = new InputSourceButton();
        self._gripRight.getValue = (): number => 0;

        self._handLeftPosition = new InputSourcePosition();
        self._handLeftPosition.getValue = (): Readonly<Vec3> => Vec3.ZERO;
        self._handLeftOrientation = new InputSourceOrientation();
        self._handLeftOrientation.getValue = (): Readonly<Quat> => Quat.IDENTITY;

        self._handRightPosition = new InputSourcePosition();
        self._handRightPosition.getValue = (): Readonly<Vec3> => Vec3.ZERO;
        self._handRightOrientation = new InputSourceOrientation();
        self._handRightOrientation.getValue = (): Readonly<Quat> => Quat.IDENTITY;

        self._aimLeftPosition = new InputSourcePosition();
        self._aimLeftPosition.getValue = (): Readonly<Vec3> => Vec3.ZERO;
        self._aimLeftOrientation = new InputSourceOrientation();
        self._aimLeftOrientation.getValue = (): Readonly<Quat> => Quat.IDENTITY;

        self._aimRightPosition = new InputSourcePosition();
        self._aimRightPosition.getValue = (): Readonly<Vec3> => Vec3.ZERO;
        self._aimRightOrientation = new InputSourceOrientation();
        self._aimRightOrientation.getValue = (): Readonly<Quat> => Quat.IDENTITY;
    }
}
