/****************************************************************************
 Copyright (c) 2024 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

#pragma once

#include <vector>

#include "base/Macros.h"
#include "base/RefCounted.h"

namespace cc {
class CC_DLL BillingResult : public cc::RefCounted {
public:
    int getResponseCode() const {
        return _responseCode;
    }

    std::string getDebugMessage() const {
        return _debugMessage;
    }

    std::string toString() const {
        return _toString;
    }
    class Builder : public cc::RefCounted {
    private:
        int _responseCode{0};
        std::string _debugMessage;
        std::string _toStr;

    public:
        Builder& setDebugMessage(const std::string& debugMsg) {
            _debugMessage = debugMsg;
            return *this;
        }
        Builder& setResponseCode(int responseCode) {
            _responseCode = responseCode;
            return *this;
        }
        BillingResult* build() {
            auto* billingResult = new BillingResult();
            billingResult->_responseCode = _responseCode;
            billingResult->_debugMessage = std::move(_debugMessage);
            return billingResult;
        }
    };
    static Builder* newBuilder() {
        return new Builder();
    }

private:
    friend class JniBilling;
    int _responseCode{0};
    std::string _debugMessage;
    std::string _toString;
};

} // namespace cc
