---
title: "Using C Macros"
author: Kevin

date: 2026-01-24

type: C
tags: draft
layout: post.html
---

I *love* `C`.

It is by far the language I'm most
comfortable programming in. I don't
mean to imply that it is always the
language which makes me the most *efficient*.
(C++ or Python are far better at saving
me time, especially when writing
userspace programs). But nonetheless
C is my favorite, often *because* of how
little it does.

Once you have a solid "theory of
operation" there are really only
so many ways a C program can go *wrong*.

> In all fairness, when it does go wrong it's
  <u>catastrophic</u>.

But as a programmer very little is hidden
from you. C tends not to do anything you
don't explicitly *ask* it to.

> This is why I find design
  choices like passing around 
  `std.Allocator`(s) in Zig so cool.
  Its just a bit too unstable for me
  to really get into it yet.

Consider that when I declare a variable in C++,
```
int main(void) {
  MyClass x;
}
```
Literally *anything* could happen.

The constructor could be allocating from the
heap. It could be opening a TCP connection.
It could be launching a dozen worker threads.
Hell, it could be launching the JVM and
TAS-ing *Minecraft* for all we know just from this
one line of code.

But when I write the following bit of C
```
int main(void) {
  MyStruct x;
}
```
I'd be willing to bet my life (and probably
some of my friends lives) that I can guess
exactly what code the compiler will generate.

> {{bend}} On x86 it'll almost certainly
  just be one instruction
  (or *zero* if optimizing)
  `subq $sizeof(MyStruct), %rsp`
  This just allocates some space on the stack,
  not even bothering to initialize it.

This obviously isn't true for every example of C code;
[an innocent enough looking `printf` may actually be playing Tic-Tac-Toe](https://www.ioccc.org/2020/carlini/).
But things like that are *intentionally* abusing
the features (and bugs) of the language.
For the most part, C embodies the ideal of
"what you see is what you get".

Ironically, that is until you get to my *other*
favorite part of the C language: *Macros*.

Strictly speaking C macros are not a part of C
itself. They are applied by the "C preprocessor"
`cpp` which can actually be run on any text file
you'd like.

If you're unfamiliar with how the C preprocessor
works, its helpful to think of it as nothing more
than glorified "copy and paste".
If it receives something like
```
#define MY_MACRO wahooo

MY_MACRO, MY_MACRO, MY_MACRO
```
as input, then it will output
```
wahooo, wahooo, wahooo
```
It *looks* like macros are a feature of C itself
because when you run the compiler, it actually
invokes `cpp` on every input file it receives,
before actually doing the work of parsing and compiling.

This is great in the sense that Macros can be used
to manipulate/generate the source code itself. But
it is bad in the sense that it is even less clear what
```
int main(void) {
    /* the starting lines of main */

    MY_MACRO
    
    /* the ending lines of main */
}
```
could be doing than it was what `MyClass x;` could have
been doing in C++. Consider what would happen if it were
defined as:
```
#define MY_MACRO return 0; } int some_entirely_new_function(void) {
```
then after it has been preprocessed it will look something like
```
int main(void) {
    /* the starting lines of main */
    return 0;
}
int some_entirely_new_function(void) {
    /* (what were supposed to be) the ending lines of main */
}
```
This is quite obviously terrible if you have any expectation
that *reading* the code should give you an idea what the code
might be doing. And as such its pretty common advice that 
macros should be used carefully and sparingly.

> I'm not very good at adhering to this advice.

My first impression of macros was "cool I guess".
But that was back when I thought their only real use
case was to define compiler time constants. That all
changed when I was introduced to what I think the
*real* reason C-macros are so cool: X Macros.

## X Macros

A pretty common scenario I find myself in while writing
C is defining an `enum` such as
```
typedef enum {

    MY_STATE_A,
    MY_STATE_B,
    MY_STATE_C,

} my_state_t;
```
and then having to define a boilerplate function
along the lines of
```
const char *
my_state_to_string(my_state_t state) {
    switch(state) {
        case MY_STATE_A: return "MY_STATE_A";
        case MY_STATE_B: return "MY_STATE_B";
        case MY_STATE_C: return "MY_STATE_C";
        default: return "MY_STATE_INVALID";
    }
}
```
just to be able to print out a discernable error/debug
message related to `my_state_t`.

If later on we add a new state `MY_STATE_D` to `my_state_t`,
then we also need to go back and add
```
case MY_STATE_D: return "MY_STATE_D";
```
or else all of our debug messages will print out
`MY_STATE_INVALID` when the state is in-fact quite
`VALID`.

> Trying to fix a bug with *incorrect* error messages
  is a nightmare I wouldn't wish on my worst enemy.

Wouldn't it be *nice* if we could just update our code
in *one* place instead of two (or three, or four, or 5 dozen)
places? After all, each `case THING: "THING"` statement is
pretty much the definition of "boilerplate".

So consider if we replace the `enum` with:
```
#define MY_STATE_XLIST(X) \
X(A)\
X(B)\
X(C)

typedef enum
{
#define DECLARE_MY_STATE_ENUM(NAME) \
  MY_STATE_ ## NAME
  
  MY_STATE_XLIST(DECLARE_MY_STATE_ENUM)

#undef DECLARE_MY_STATE_ENUM

} my_state_t;
```

