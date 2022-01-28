const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
	const that = this
	that.state = PENDING
	that.value = null
	that.resolvedCallbacks = []
	that.rejectedCallbacks = []
	function resolve(value) {
		if (value instanceof MyPromise) {
			return value.then(resolve, rejecte)
		}
		setTimeout(() => {
			// 仅当状态为pending时执行
			if (that.state === PENDING) {
				that.state = RESOLVED
				that.value = value
				that.resolvedCallbacks.map(cb => cb(that.value))
			}
		}, 0)
	}

	function rejecte(value) {
		setTimeout(() => {
			// 仅当状态为pending时执行
			if (that.state === PENDING) {
				that.state = REJECTED
				that.value = value
				that.rejectedCallbacks.map(cb => cb(that.value))
			}
		}, 0)
	}
	try {
		fn(resolve, rejecte)
	} catch (e) {
		rejecte(e)
	}
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
	const that = this
	onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
	onRejected =
		typeof onRejected === 'function'
			? onRejected
			: r => {
					throw r
			  }
	if (that.state === PENDING) {
		return (promise2 = new MyPromise((resolve, reject) => {
			that.resolvedCallbacks.push(() => {
				try {
					const x = onFulfilled(that.value)
					resolutionProcedure(promise2, x, resolve, reject)
				} catch (r) {
					reject(r)
				}
			})

			that.rejectedCallbacks.push(() => {
				try {
					const x = onRejected(that.value)
					resolutionProcedure(promise2, x, resolve, reject)
				} catch (r) {
					reject(r)
				}
			})
		}))
	}
	if (that.state === RESOLVED) {
		return (promise2 = new MyPromise((resolve, reject) => {
			setTimeout(() => {
				try {
					const x = onFulfilled(that.value)
					resolutionProcedure(promise2, x, resolve, reject)
				} catch (r) {
					reject(r)
				}
			}, 0)
		}))
	}
	if (that.state === REJECTED) {
		return (promise2 = new MyPromise((resolve, reject) => {
			setTimeout(() => {
				try {
					const x = onRejected(that.value)
					resolutionProcedure(promise2, x, resolve, reject)
				} catch (r) {
					reject(r)
				}
			}, 0)
		}))
	}

	function resolutionProcedure(promise2, x, resolve, reject) {
		if (promise2 === x) {
			return reject(new TypeError('Error'))
		}
		// if (x instanceof MyPromise) {
		// 	x.then(function (value) {
		// 		resolutionProcedure(promise2, value, resolve, reject)
		// 	}, reject)
		// }
		let called = false
		if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
			try {
				let then = x.then
				if (typeof then === 'function') {
					then.call(
						x,
						y => {
							if (called) return
							called = true
							resolutionProcedure(promsie2, y, resolve, reject)
						},
						e => {
							if (called) return
							called = true
							reject(e)
						}
					)
				} else {
					resolve(x)
				}
			} catch (e) {
				if (called) return
				called = true
				reject(e)
			}
		} else {
			resolve(x)
		}
	}
}

new MyPromise((resolve, reject) => {
	resolve(1)
}).then(value => {
	console.log('a')
	return 'hh'
})
