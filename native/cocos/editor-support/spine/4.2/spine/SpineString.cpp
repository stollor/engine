/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated January 1, 2020. Replaces all prior versions.
 *
 * Copyright (c) 2013-2020, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software
 * or otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#include <spine/SpineString.h>

// Required for sprintf on MSVC
#ifdef _MSC_VER
    #pragma warning(disable : 4996)
#endif

namespace spine {
String::String() : _length(0), _buffer(NULL), _tempowner(true) {
}

String::String(const char *chars, size_t len, bool own) {
    _tempowner = true;
    if (!chars) {
        _length = 0;
        _buffer = NULL;
    } else {
        _length = len;
        if (!own) {
            _buffer = SpineExtension::calloc<char>(_length + 1, __SPINE_FILE__, __SPINE_LINE__);
            _buffer[_length] = '\0';
            memcpy((void *)_buffer, chars, _length);
        } else {
            _buffer = (char *)chars;
        }
    }
}

String::String(const char *chars, bool own /* = false*/, bool tofree /* = true*/) : String(chars, nullptr == chars ? 0 : strlen(chars), own) {
    _tempowner = tofree;
}


String::String(const String &other) {
    _tempowner = true;
    if (!other._buffer) {
        _length = 0;
        _buffer = NULL;
    } else {
        _length = other._length;
        _buffer = SpineExtension::calloc<char>(other._length + 1, __SPINE_FILE__, __SPINE_LINE__);
        memcpy((void *)_buffer, other._buffer, other._length + 1);
    }
}

void String::own(const String &other) {
    if (this == &other) return;
    if (_buffer && _tempowner) {
        SpineExtension::free(_buffer, __SPINE_FILE__, __SPINE_LINE__);
    }
    _length = other._length;
    _buffer = other._buffer;
    other._length = 0;
    other._buffer = NULL;
}

void String::own(const char *chars) {
    if (_buffer == chars) return;
    if (_buffer && _tempowner) {
        SpineExtension::free(_buffer, __SPINE_FILE__, __SPINE_LINE__);
    }

    if (!chars) {
        _length = 0;
        _buffer = NULL;
    } else {
        _length = strlen(chars);
        _buffer = (char *)chars;
    }
}

void String::unown() {
    _length = 0;
    _buffer = NULL;
}

String &String::operator=(const String &other) {
    if (this == &other) return *this;
    if (_buffer && _tempowner) {
        SpineExtension::free(_buffer, __SPINE_FILE__, __SPINE_LINE__);
    }
    if (!other._buffer) {
        _length = 0;
        _buffer = NULL;
    } else {
        _length = other._length;
        _buffer = SpineExtension::calloc<char>(other._length + 1, __SPINE_FILE__, __SPINE_LINE__);
        memcpy((void *)_buffer, other._buffer, other._length + 1);
    }
    return *this;
}

String &String::operator=(const char *chars) {
    if (_buffer == chars) return *this;
    if (_buffer && _tempowner) {
        SpineExtension::free(_buffer, __SPINE_FILE__, __SPINE_LINE__);
    }
    if (!chars) {
        _length = 0;
        _buffer = NULL;
    } else {
        _length = strlen(chars);
        _buffer = SpineExtension::calloc<char>(_length + 1, __SPINE_FILE__, __SPINE_LINE__);
        memcpy((void *)_buffer, chars, _length + 1);
    }
    return *this;
}

String &String::append(const char *chars) {
    size_t len = strlen(chars);
    size_t thisLen = _length;
    _length = _length + len;
    bool same = chars == _buffer;
    _buffer = SpineExtension::realloc(_buffer, _length + 1, __SPINE_FILE__, __SPINE_LINE__);
    memcpy((void *)(_buffer + thisLen), (void *)(same ? _buffer : chars), len + 1);
    return *this;
}

String &String::append(const String &other) {
    size_t len = other.length();
    size_t thisLen = _length;
    _length = _length + len;
    bool same = other._buffer == _buffer;
    _buffer = SpineExtension::realloc(_buffer, _length + 1, __SPINE_FILE__, __SPINE_LINE__);
    memcpy((void *)(_buffer + thisLen), (void *)(same ? _buffer : other._buffer), len + 1);
    return *this;
}

String &String::append(int other) {
    char str[100];
    sprintf(str, "%i", other);
    append(str);
    return *this;
}

String &String::append(float other) {
    char str[100];
    sprintf(str, "%f", other);
    append(str);
    return *this;
}

bool operator==(const String &a, const String &b) {
    if (a._buffer == b._buffer) return true;
    if (a._length != b._length) return false;
    if (a._buffer && b._buffer) {
        return strcmp(a._buffer, b._buffer) == 0;
    } else {
        return false;
    }
}

bool operator!=(const String &a, const String &b) {
    return !(a == b);
}

String::~String() {
    if (_buffer && _tempowner) {
        SpineExtension::free(_buffer, __SPINE_FILE__, __SPINE_LINE__);
    }
}

String String::substring(int startIndex, int length) const {
    if (startIndex < 0 || startIndex >= (int)_length || length < 0 || startIndex + length > (int)_length) {
        return String();
    }
    char *subStr = SpineExtension::calloc<char>(length + 1, __FILE__, __LINE__);
    memcpy(subStr, _buffer + startIndex, length);
    subStr[length] = '\0';
    return String(subStr, true, true);
}

String String::substring(int startIndex) const {
    if (startIndex < 0 || startIndex >= (int)_length) {
        return String();
    }
    int length = (int)_length - startIndex;
    char *subStr = SpineExtension::calloc<char>(length + 1, __FILE__, __LINE__);
    memcpy(subStr, _buffer + startIndex, length);
    subStr[length] = '\0';
    return String(subStr, true, true);
}

int String::lastIndexOf(const char c) const {
    for (int i = (int)length() - 1; i >= 0; i--) {
        if (buffer()[i] == c) return i;
    }
    return -1;
}

bool String::startsWith(const String &needle) const {
    if (needle.length() > length()) return false;
    for (int i = 0; i < (int)needle.length(); i++) {
        if (buffer()[i] != needle.buffer()[i]) return false;
    }
    return true;
}

} // namespace spine
