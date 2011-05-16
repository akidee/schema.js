var objecttools = require('../lib/objecttools'),
	a = require('assert')




// id()

var p = {}

objecttools.id(p)

a.strictEqual(
	p.__id,
	0
)

a.strictEqual(
	objecttools.id(p),
	0
)

var q = {}

a.strictEqual(
	objecttools.id(q),
	1
)




// find()

p = {
	a: {
		b: [
			{
				c: 5
			}
		]
	},
	d: true
}

a.deepEqual(
	objecttools.find(p, [ 'a', 'b' ]),
	[
		{
			c: 5
		}
	]
)

a.deepEqual(
	objecttools.find(p, [ 'a', 'b', 0 ]),
	{
		c: 5
	}
)

a.strictEqual(
	objecttools.find(p, [ 'd' ]),
	true
)

a.strictEqual(
	objecttools.find(p, [ 'a', 'b', 'c' ]),
	undefined
)




// resetRefs()

var o = { c: 1 }

objecttools.resetRefs(o)

a.deepEqual(
	o.$refs,
	[]
)

p = []

objecttools.resetRefs(p)

a.deepEqual(
	p[p.length - 1],
	{ $$refs: [] }
)




// getRefs()

a.deepEqual(
	objecttools.getRefs(o),
	[]	
)

a.deepEqual(
	objecttools.getRefs(p),
	[]	
)




// addRef()

a.deepEqual(
	objecttools.addRef(o, [ 'a' ], [ '#' ]),
	[[ 'a' ], [ '#' ]]
)

a.deepEqual(
	objecttools.addRef(p, [ 'a' ], [ '#' ]),
	[[ 'a' ], [ '#' ]]	
)

global.xy = true

objecttools.addRef(o, [ 'b' ], [ 'xy' ])
objecttools.addRef(p, [ 'b' ], [ 'xy' ])




// findRefs()

var q = {}
q.a = q
q.b = q

objecttools.findRefs(q)

a.strictEqual(
	q.__id,
	2
)

a.deepEqual(
	q.$refs,
	[
		[ 'a' ], [ '#' ],
		[ 'b' ], [ '#' ]
	]
)

objecttools.findRefs(q)

a.strictEqual(
	q.__id,
	2
)

a.deepEqual(
	q.$refs,
	[
		[ 'a' ], [ '#' ],
		[ 'b' ], [ '#' ]
	]
)




// resolveRefs()

objecttools.resolveRefs(o)

a.deepEqual(
	o.a,
	o
)

a.deepEqual(
	o.b,
	undefined
)

a.deepEqual(
	objecttools.getRefs(o),
	[ [ 'b' ], [ 'xy' ] ]
)

objecttools.resolveRefs(o, true)

a.deepEqual(
	o.a,
	o
)

a.deepEqual(
	o.b,
	true
)

a.deepEqual(
	objecttools.getRefs(o),
	[]
)




console.log('Passed')
