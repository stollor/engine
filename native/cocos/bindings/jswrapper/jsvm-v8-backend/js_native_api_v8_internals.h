#ifndef SRC_JS_NATIVE_API_V8_INTERNALS_H_
#define SRC_JS_NATIVE_API_V8_INTERNALS_H_

// The V8 implementation of N-API, including `js_native_api_v8.h` uses certain
// idioms which require definition here. For example, it uses a variant of
// persistent references which need not be reset in the constructor. It is the
// responsibility of this file to define these idioms. Optionally, this file
// may also define `NAPI_VERSION` and set it to the version of N-API to be
// exposed.

// In the case of the Node.js implementation of N-API some of the idioms are
// imported directly from Node.js by including `node_internals.h` below. Others
// are bridged to remove references to the `node` namespace. `node_version.h`,
// included below, defines `NAPI_VERSION`.

#include "node_version.h"

//cjh #include "env.h"
//cjh #include "gtest/gtest_prod.h"
// #include "node_errors.h"
// #include "node_internals.h"

#include "util.h"

#define JSVM_ARRAYSIZE(array) node::arraysize((array))

#define JSVM_FIXED_ONE_BYTE_STRING(isolate, string)                            \
  node::FIXED_ONE_BYTE_STRING((isolate), (string))

#define JSVM_PRIVATE_KEY(isolate, suffix)                                      \
    (v8impl::GetIsolateData(isolate)->jsvm_##suffix##_key.Get(isolate))

namespace v8impl {

template <typename T>
using Persistent = v8::Global<T>;

using PersistentToLocal = node::PersistentToLocal;

inline void OnFatalError(const char* location,
                                      const char* message) {
//cjh  node::OnFatalError(location, message);
}

}  // end of namespace v8impl

#endif  // SRC_JS_NATIVE_API_V8_INTERNALS_H_
