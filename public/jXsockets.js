/*
* XSockets.NET jXSockets.1.0.6.beta
* http://xsockets.net/
* Distributed in whole under the terms of the MIT
 
*
* Copyright 2012, Magnus Thor & Ulf Björklund
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
 
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
 
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
*/
var Subscriptions = (function () {
    /// <summary>
    ///     Module to handle subscriptions (add,get,remove) and all its callbacks.
    /// </summary>           
    var subscriptions = [];

    this.add = function (name, fn, opt) {
        /// <summary>
        ///     if a subscription with the same name exists the function will be
        ///     added to the callback list.
        ///     if the subscription does not exist a new one will be created.
        ///     
        ///     Returns the index of the callback added to be used if you only want to remove a specific callback.
        /// </summary>

        /// <param name="name" type="string">
        ///    Name of the subscription.
        /// </param>

        /// <param name="fn" type="function">
        ///    The callback function to add
        /// </param>
        name = name.toLowerCase();
        var storedSub = this.get(name);
        if (storedSub === null) {
            var sub = new subscription(name);
            sub.addCallback(fn, opt);
            subscriptions.push(sub);
            return 1;
        }
        storedSub.addCallback(fn, opt);
        return storedSub.Callbacks.length;
    };

    this.get = function (name) {
        /// <summary>
        ///     Returns the subscription and all its callbacks.
        ///     if not found null is returned.
        /// </summary>

        /// <param name="name" type="string">
        ///    Name of the subscription.
        /// </param> 
        name = name.toLowerCase();
        for (var i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].Name === name) return subscriptions[i];
        }
        return null;
    };

    this.getAll = function () {
        /// <summary>
        ///     Returns all the subscriptions.        
        /// </summary>
        return subscriptions;
    };

    this.remove = function (name, ix) {
        /// <summary>
        ///     Removes a subscription with the matching name.
        ///     if ix of a callback is passed only the specific callback will be removed.
        ///     
        ///     Returns true if something was removed, false if nothing was removed.
        /// </summary>

        /// <param name="name" type="string">
        ///    Name of the subscription.
        /// </param>

        /// <param name="ix" type="number">
        ///    The index of the callback to remove (optional)
        /// </param>
        name = name.toLowerCase();
        for (var i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].Name === name) {
                if (ix === undefined) {
                    subscriptions.splice(i, 1);
                } else {
                    subscriptions[i].Callbacks.splice(ix - 1, 1);
                    if (subscriptions[i].Callbacks.length === 0) subscriptions.splice(i, 1);
                }
                return true;
            }
        }
        return false;
    };

    this.fire = function (name, message, cb, ix) {
        /// <summary>
        ///     Triggers all callbacks on the subscription, or if ix is set only that callback will be fired.
        /// 
        /// </summary>

        /// <param name="name" type="string">
        ///    Name of the subscription.
        /// </param>

        /// <param name="ix" type="number">
        ///    The index of the callback to trigger (optional)
        /// </param>
        name = name.toLowerCase();
        for (var i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].Name === name) {
                if (ix === undefined) {
                    subscriptions[i].fireCallbacks(message, cb);
                } else {
                    subscriptions[i].fireCallback(message, cb, ix);
                }
            }
        }
    };

    var subscription = function (name) {
        this.Name = name;
        this.Callbacks = [];
        this.addCallback = function (fn, opt) {
            this.Callbacks.push(new callback(fn, opt));
        };
        this.fireCallback = function (message, cb, ix) {
            this.Callbacks[ix - 1].fn(message);
            //Handle potential unbind for one and many
            if (typeof (this.Callbacks[ix - 1].state) === "object") {
                if (typeof (this.Callbacks[ix - 1].state.options) !== "undefined" && typeof (this.Callbacks[ix - 1].state.options.counter) !== "undefined") {
                    this.Callbacks[ix - 1].state.options.counter.messages--;
                    if (this.Callbacks[ix - 1].state.options.counter.messages === 0) {
                        if (typeof (this.Callbacks[ix - 1].state.options.counter.completed) === 'function') {
                            this.Callbacks[ix - 1].state.options.counter.completed();
                        }
                    }
                }
            }

            if (cb && typeof (cb) === "function") {
                cb();
            }
        };
        this.fireCallbacks = function (message, cb) {
            for (var c = 0; c < this.Callbacks.length; c++) {
                this.fireCallback(message, cb, c + 1);
            }
        };
    };
    var callback = function (func, opt) {
        this.fn = func;
        this.state = opt;
    };
    return this;
})();

(function () {
    "use strict";
    var jXSockets = {


        Events: {
            onError: "xsockets.onerror",
            open: "xsockets.xnode.open",
            close: "close",
            storage: {
                set: "xsockets.storage.set",
                get: "xsockets.storage.get",
                getAll: "xsockets.storage.getall",
                remove: "xsockets.storage.remove"
            },
            onBlob: "blob"
        },

        extend: function (obj, extObj) {
            if (arguments.length > 2) {
                for (var a = 1; a < arguments.length; a++) {
                    extend(obj, arguments[a]);
                }
            } else {
                for (var i in extObj) {
                    obj[i] = extObj[i];
                }
            }
            return obj;
        },

        WebSocket: function (url, subprotocol, settings) {
            /// <summary>
            /// XSockets.NET JavaScript API 
            /// </summary>

            ///<param name="url" type="String">
            /// The WebSocket handler (URL) to connect to. i.e ws://127.0.0.1:4502/GenericText
            ///</param>

            ///<param name="subprotocol" type="String">
            /// Subprotocol i.e Chat 
            ///</param>          

            var self = this;


            var options = XSockets.extend({
                apikey: null
            }, settings);

            var webSocket = null;
            var pubSub = {
                subscribe: "xsocket.subscribe",
                unsubscribe: "xsocket.unsubscribe",
                getSubscriptions: "xsocket.getsubscriptions",
                getAllSubscriptions: "xsocket.getallsubscriptions"
            };


            this.close = function (fn) {
                /// <summary>
                ///     Close the corrent XSocket WebSocket instance
                /// </summary>
                /// <param name="fn" type="function">
                ///    A function to execute when closed.
                /// </param>   
                webSocket.close();
                if (typeof fn === "function") fn();
            };
            this.bind = function (event, fn, options, callback) {
                /// <summary>
                ///     Attach a handler (subscription) for the current WebSocket Handler
                /// </summary>

                /// <param name="event" type="string">
                ///    Name of the event to subscribe to (bind)
                /// </param> 

                /// <param name="fn" type="function">
                ///    A function to execute each time the event (subscription) is triggered.
                /// </param>   

                /// <param name="options" type="object">
                ///   event (subscriptions) options
                /// </param>

                /// <param name="callback" type="function">
                ///    A function to execute when completed.
                /// </param>
                var o = {
                    options: options,
                    ready: webSocket.readyState
                };

                if (o.ready === 1) {

                    self.trigger(new XSockets.Message(pubSub.subscribe, {
                        Event: event
                    }));
                }
                Subscriptions.add(event, fn, o);

                if (callback && typeof (callback) === "function") {
                    callback();
                }
            };
            this.unbind = function (event, callback) {
                /// <summary>
                ///     Remove a previously-attached event handler (subscription).
                /// </summary>
                /// <param name="event" type="String">
                ///    Name of the event (subscription) to unbind.
                /// </param>           
                /// <param name="callback" type="function">
                ///    A function to execute when completed.
                /// </param>   
                if (Subscriptions.remove(event)) {
                    self.trigger(new XSockets.Message(pubSub.unsubscribe, {
                        Event: event
                    }));
                }
                if (callback && typeof (callback) === "function") {
                    callback();
                }
            };
            this.many = function (event, count, callback, options) {
                /// <summary>
                ///     Attach a handler to an event (subscription) for the current WebSocket Handler,  unbinds when the event is triggered the specified number of (count) times.
                /// </summary>
                /// <param name="event" type="String">
                ///    Name of the event (subscription)
                /// </param>           
                /// <param name="count" type="Number">
                ///     Number of times to listen to this event (subscription)
                /// </param>           
                /// <param name="callback" type="Function">
                ///    A function to execute at the time the event is triggered the specified number of times.
                /// </param> 
                /// <param name="options" type="object">
                ///   event (subscriptions) options
                /// </param>
                self.bind(event, callback, XSockets.extend({
                    counter: {
                        messages: count,
                        completed: function () {
                            self.unbind(event);
                        }

                    }
                }, options));
            };
            this.one = function (event, callback, options) {
                /// <summary>
                ///    Attach a handler to an event (subscription) for the current WebSocket Handler. The handler is executed at most once.
                /// </summary>

                /// <param name="event" type="String">
                ///    Name of the event (subscription)
                /// </param>           

                /// <param name="callback" type="Function">
                ///    A function to trigger when executed once.
                /// </param>       

                /// <param name="options" type="object">
                ///   event (subscriptions) options
                /// </param>  
                self.bind(event, callback, XSockets.extend({
                    counter: {
                        messages: 1,
                        completed: function () {
                            self.unbind(event);
                        }
                    }
                }, options));
            };
            this.trigger = function (event, json, callback) {
                /// <summary>
                ///      Trigger (Publish)  a WebSocketMessage (event) to the current WebSocket Handler.
                /// </summary>
                /// <param name="event" type="string">
                ///     Name of the event (publish)
                /// </param>                
                /// <param name="json" type="JSON">
                ///     JSON representation of the WebSocketMessage to trigger/send (publish)
                /// </param>
                /// <param name="callback" type="function">
                ///      A function to execute when completed. 
                /// </param>
                if (typeof (event) !== "object") {
                    event = event.toLowerCase();
                    var message = XSockets.Message(event, json);

                    send(message.toString());
                    if (callback && typeof (callback) === "function") {

                        callback();
                    }
                } else {
                    send(event.toString());
                    if (json && typeof (json) === "function") {

                        json();
                    }
                }
            };
            this.send = function (payload) {
                /// <summary>
                ///     Send a binary message to the current WebSocket Handler
                /// </summary>
                /// <param name="payload" type="Blob">
                ///     Binary object to send (Blob/ArrayBuffer).
                /// </param>  
                webSocket.send(payload);
            };

            var dispatch = function (eventName, message) {
                if (Subscriptions.get(eventName) === null) {
                    return;
                }
                if (typeof message === "string") {
                    message = JSON.parse(message);
                }

                Subscriptions.fire(eventName, message, function () {
                    //console.log('stupid callback');
                });
            };

            var raiseEvent = function (message) {

                var event = null;
                if (typeof message.data === "string") {

                    var msg = JSON.parse(message.data);
                    event = msg.event;
                    dispatch(event, msg.data);
                } else {
                    dispatch("blob", message.data);

                }
            };
            var send = function (payload) {
                webSocket.send(payload);
            };

            Array.prototype.removeItem = function (str) {
                for (var i = 0; i < this.length; i++) {
                    if (escape(this[i]).match(escape(str.trim()))) {
                        this.splice(i, 1);
                        break;
                    }
                }
                return this;
            };




            if ('WebSocket' in window) {
                var clientGuid = window.localStorage.getItem("XSocketsClientStorageGuid" + subprotocol);

                if (options.apikey !== null) {
                    url = url + "?apikey=" + options.apikey;
                    if (clientGuid !== null) {
                        url = url + "&XSocketsClientStorageGuid=" + clientGuid;
                    }
                } else {
                    if (clientGuid !== null) {
                        url = url + "?XSocketsClientStorageGuid=" + clientGuid;
                    }
                }


                webSocket = new window.WebSocket(url, subprotocol);

            }


            if (webSocket !== null) {

                self.bind(jXSockets.Events.open, function (data) {

                    window.localStorage.setItem("XSocketsClientStorageGuid" + subprotocol, data.StorageGuid);
                    var chain = Subscriptions.getAll();
                    for (var e = 0; e < chain.length; e++) {
                        for (var c = 0; c < chain[e].Callbacks.length; c++) {
                            if (chain[e].Callbacks[c].ready !== 1) {
                                self.trigger(new XSockets.Message(pubSub.subscribe, {
                                    Event: chain[e].Name
                                }));
                            }
                        }
                    }
                }, {
                    subscribe: false
                });

                webSocket.onclose = function (msg) {
                    dispatch('close', msg);
                };
                webSocket.onopen = function (msg) {
                    dispatch('open', msg);
                };
                webSocket.onmessage = function (message) {

                    raiseEvent(message);
                };

            }

            return self;
        },

        Message: function (event, object) {
            /// <summary>
            ///     Create a new XSockets Message
            /// </summary>
            /// <param name="event" type="string">
            ///     Name of the event
            /// </param>             
            /// <param name="object" type="object">
            ///     The message payload (JSON)
            /// </param>  

            var json = {
                event: event,
                data: JSON.stringify(object)

            };

            this.JSON = function () {
                return json;
            } ();


            this.toString = function () {
                return JSON.stringify(json);
            };

            return this;


        }
    };
    if (!window.jXSockets) {
        window.jXSockets = jXSockets;
    }
    if (!window.XSockets) {
        window.XSockets = jXSockets;
    }
})();