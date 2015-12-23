# Getting started with GlueStick
This tutorial will help introduce GlueStick and some of its awesome features.
We hope that you find this tool improves your productivity and enjoyment in
building front-end web applications.

If you missed our initial announcement, GlueStick is a command line interface
that helps you rapidly develop universal React applications. It handles asset
package management, server side rendering, and it comes with a fully functional
testing environment and generators to help you move quickly.
[https://github.com/TrueCar/gluestick](https://github.com/TrueCar/gluestick)

## Installation
We are attempting to build a tool for tomorrow’s web applications. Our primary
target at this time is the latest version of Node v5+ but you should be able to
use Node v4+ as well.

Once you have the latest version of node installed on your machine, you just
need to run the following command to get GlueStick on your machine.
`sudo npm install gluestick -g`

## Creating a new application
GlueStick attempts to handle as much of the non-application specific code as it
can for you. However, there is still some boilerplate code and a common folder
structure that you will need to build a GlueStick app. To make this simple
GlueStick provides the `new` command.

To create a new application run the following command:
`gluestick new ExampleApp`

This is going to create a folder named ExampleApp in the folder you ran the
command. This will set up the folder structure for you as well as install all
of the `node_modules` that you will need for the base application.
 
Here is an example of what you can expect to see in the newly created
ExampleApp folder:
```
assets/
  - css
    - normalize.css
Index.js
package.json
src/
    - actions/
    - components/
        - Home.js
        - MasterLayout.js
    - config/
        - application.js
        - routes.js
    - containers/
        - HomeApp.js
    - reducers/
        - index.js
test/
    - components/
        - Home.test.js
```
 

## Running your application
Now that we have a new project started, let’s run our application in the
browser. Change directories into the ExampleApp folder `cd ExampleApp` and run
the `start` command.

`gluestick start`

This will kick off a few things. It is going to run your code through webpack
dev server as well as run our universal web server. The webpack dev server
allows us to enable some really cool features like `hot-module-replacement` so
you don’t have to refresh the browser to see some changes as your write your
app. The universal web server piece will let us do server side rendering of
your React application.

Not only does the `start` command kick off our servers, but it also starts up
our test runner in it’s own dedicated Chrome instance so you can have tests
continuously running while you work on your app.

Now open your browser to [http://localhost:8888](http://localhost:8888/) and you should be greeted with
the text “Home”.

## Hot Module Replacement
Now we will show you how own of our favorite features, hot module replacement,
works. Open up `src/components/Home.js` in your favorite editor, and update the
text Home to say “Hello World!” instead. Make sure the web browser is visible
when you do this and you will see that “Home” will change to “Hello World!”
right before you without refreshing the browser.

This would be a good time to introduce the tool we use for styling, Radium
[http://stack.formidable.com/radium/](http://stack.formidable.com/radium/). We
wont go into all of the details why Radium is so amazing, the Radium docs do a
good enough job of that. GlueStick projects have Radium all set up for you. You
just need to follow 3 simple steps to use Radium with your component.

1.  Import Radium
```
@import Radium from "radium"
```
2.  Decorate your class using the Radium decorator 
```
@Radium
export default class Home extends Component {
```
3.  Define your styles in an object.
```
const styles = {
    header: {
        color: "green"
    }
};
```
4.  Apply the style to an element
```
<div style={styles.header}>Hello World!</div>
```

So our entire component should now look like this:
```
import React, { Component, PropTypes } from "react";
import Radium from "radium";

@Radium
export default class Home extends Component {
    render () {
        return (
            <div style={styles.header}>
                Hello World!
            </div>
        );
    }
}

const styles = {
    header: {
        color: "green"
    }
};
```

Immediately after you save the file, “Hello World!” will turn green without
refreshing the browser. The ability to quickly iterate over styles without
refreshing the browser is a huge boost in productivity. Thanks to all of the
open source tools we use under the hood with GlueStick, this kind of flow was
relatively easy to get working.

## Generating a container
GlueStick includes several generators to help make you more productive. The
first one we will show you is the Container generator. GlueStick apps use Redux
for managing application state. When using Redux, components that are directly
connected to Redux are referred to as containers.
[https://github.com/TrueCar/gluestick](http://rackt.org/redux/docs/basics/UsageWithReact.html).
These will generally be components that we connect to a route in our router.

For the rest of this Getting Started guide, we will start building a todo list
application. So let's start by generating a container for our todo list.

```
gluestick generate container Todos
```

This will generate the following file:
src/containers/Todos.js

```
import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

@connect(
    (state) => ({/** _INSERT_STATE_  **/}),
    (dispatch) => bindActionCreators({/** _INSERT_ACTION_CREATORS_ **/}, dispatch)
)
export default class Todos extends Component {
    static fetchData ({dispatch}) {}

    render () {
        return (
            <div>Todos</div>
        );
    }
}
```

As you can see this is a simple component that is already hooked up to the
Redux store for you. Notice the static method, `fetchData`, we will show you
how to use this in more detail later, but this method gives you a hook where
you can asynchrounsly fetch data before your container is rendered. Your
server-side request wont respond until all of the data is filled in for you so
that you don't end up returning your app's loading state for everything.

To match this container to a route, we will need to add an entry to the routes
file. If you have used (React Router)[https://github.com/rackt/react-router]
then the routes file will look familiar to you since that is what we are using.
The only difference is that we've already hooked up the router for you so that
you can just focus on defining your routes.

The routes file is located at `src/config/routes.js` and it looks like this:
```
import React from "react";
import { Route, IndexRoute } from "react-router";

import MasterLayout from "../components/MasterLayout";
import HomeApp from "../containers/HomeApp";

export default (
    <Route name="app" component={MasterLayout} path="/">
        <IndexRoute name="home" component={HomeApp} />
    </Route>
);
```

Matching our newly created Todos container with a route is simple. First import
your container, then add a nested route with the correct path and component.
```
import React from "react";
import { Route, IndexRoute } from "react-router";

import MasterLayout from "../components/MasterLayout";
import HomeApp from "../containers/HomeApp";
import Todos from "../containers/Todos";

export default (
    <Route name="app" component={MasterLayout} path="/">
        <IndexRoute name="home" component={HomeApp} />
        <Route name="todos" component={Todos} path="/todos" />
    </Route>
);
```

Now direct your browser to
[http://localhost:8888/todos](http://localhost:8888/todos) and your new
container should show up.

## Generating a Component
React applications are made up of lots of components. They almost all start
with the same few lines of code and so we made a generator to speed things up.
We want to encurrage developers to write unit tests for their components so we
didn't stop there. Whenever you use the generate to create a new component, it
will also create a test file for that component along with a very basic test to
verify that it is rendering without any issues.

To generate a new component, simply enter:
`gluestick generate component TodoList`

This will generate two files:
src/components/TodoList.js
```
import React, { Component, PropTypes } from "react";

export default class TodoList extends Component {
    render () {
        return (
            <div>
                TodoList
            </div>
        );
    }
}
```

test/components/TodoList.test.js
```
import TodoList from "components/TodoList";

describe("components/TodoList", () => {
    it("should render without an issue", () => {
        const subject = <TodoList />;
        const renderedSubject = TestUtils.renderIntoDocument(subject);
        expect(renderedSubject).to.not.equal(undefined);
    });
});
```

As you make changes to your application, our test suite will automatically
re-run your tests as you develop. The results from these tests will show up in
your terminal as well as a push notification every time the tests are run to
show you whether or not they all passed. Under the hood our test suite is made
up of [Karma](http://karma-runner.github.io), [Mocha](https://mochajs.org),
[Sinon](http://sinonjs.org/), and [Chai](http://chaijs.com/).

## Generating a Reducer
GlueStick applications use [Redux](https://github.com/rackt/redux) to manage
application state. Put simply, Redux lets us manage our application state as a
single object that is propagated throughout our app. To change the state, we
take our current state object and pass it off to reducers that determine what
the new state should look like based on a given action. GlueStick hooks up all
the boilerplate code for you so that you can get right down to business.

To generate a reducer, simply enter:
```
gluestick generate reducer todos
```

This will create a new file `src/reducers/todos.js` and modify the existing
reducers index file `src/reducers/index.js`. GlueStick looks to
`src/reducers/index.js` to know which reducers our Redux store should
incorporate.

src/reducers/todos.js
```
const INITIAL_STATE = null;

export default (state=INITIAL_STATE, action) => {
    switch (action.type) {
        default:
            return state;
    }
};
```

src/reducers/index.js
```
export { default as todos } from "./todos"
```

Let's modify our reducer so that it manages an array. That way we can add todo
list items to the piece of the state that his reducer is in charge of. For now,
let's just change the initial state from `null` to an array with two items in
it `["First Item", "Second Item"]`;
```
const INITIAL_STATE = ["First Item", "Second Item"];

export default (state=INITIAL_STATE, action) => {
    switch (action.type) {
        default:
            return state;
    }
};
```

## Hooking up our data
Now that we have a reducer that is responsible for handling the todos part of
our application state, we can expose that state to the rest of our application
through the container.

In order to do so, let's update our Todos container to the following:

src/containers/Todos.js
```
import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import TodoList from "../components/TodoList";

@connect(
    // Expose the part of the state that our todos reducer is reponsible for to our container
    (state) => ({todos: state.todos}),
    (dispatch) => bindActionCreators({/** _INSERT_ACTION_CREATORS_ **/}, dispatch)
)
export default class Todos extends Component {
    static fetchData ({dispatch}) {}

    render () {
        // Use our TodoList component and pass our todos to it
        return (
            <TodoList todos={this.props.todos} />
        );
    }
}
```

Next, let's get our TodoList component showing the items on our todo list. Update your TodoList component

src/components/TodoList.js
```
import React, { Component, PropTypes } from "react";

export default class TodoList extends Component {
    render () {
        const todos = this.renderTodos();
        return (
            <div>
                {todos}
            </div>
        );
    }

    renderTodos () {
        if (!this.props.todos) return;

        return this.props.todos.map((todo, index) => {
            return <div key={index}>{todo}</div>;
        });
    }
}
```

The `renderTodos` method will return an array of `<div>` elements containing
the todo list text. We assign this array to a variable and expose it in our
render function.

You will need to refresh the browser for this update to work. The reason for
that is because our reducer was original set up with an initial state that
wasn't an array. Hot module loading will not replace an existing state. Once
you refresh the browser, you should now see both of our todo list items on the
page.

## Turn off JavaScript
This is a good place to show off the server side rendering. Try turning off
javascript in your web browser and refreshing the page. You'll notice that you
get the exact same result! That is because we render the same page on the
server before it is sent to the user. This makes it so that your React
applications can be fully search engine optimized.

Now turn JavaScript back on and refresh the browser so we can continue building
our app.

## Generate a component for adding todos
Now that we are rendering the todo list items, it is time to allow users to add
new items to the list. Let's generate a new component named `AddTodo`.
```
gluestick generate component AddTodo
```

Once that is created, edit our `TodoList` component to include it above our list.

src/components/TodoList.js
```
import React, { Component, PropTypes } from "react";

// Import our AddTodo component
import AddTodo from "./AddTodo";

export default class TodoList extends Component {
    render () {
        const todos = this.renderTodos();
        // Update our render method to include our AddTodo component
        return (
            <div>
                <AddTodo />
                {todos}
            </div>
        );
    }

    renderTodos () {
        if (!this.props.todos) return;

        return this.props.todos.map((todo, index) => {
            return <div key={index}>{todo}</div>;
        });
    }
}
```

As soon as you save this file, you will see `AddTodo` show up above your todo
list items. We want that to be an input form so let's edit the the `AddTodo`
component.

src/components/AddTodo.js
```
import React, { Component, PropTypes } from "react";

export default class AddTodo extends Component {
    render () {
        return (
            <div>
                <form onSubmit={this.didSubmit}>
                    <input type="text" ref={(input) => this.input = input} />
                </form>
            </div>
        );
    }

    didSubmit = (e) => {
        e.preventDefault();
        const newItem = this.input.value;
        this.input.value = "";
        // @TODO: send our new item to redux
    }
}
```

Our `AddTodo` component will render a form that when submitted will call our
`didSubmit` method. We call `e.preventDefault()` to prevent the form from doing
a traditional form submission, which would leave the page. We make our `input`
element available to our methods using the `ref` property. [See React docs for
more information on refs]
(https://facebook.github.io/react/docs/more-about-refs.html). When `didSubmit`
is called, we capture the value from the input and then we clear the form. The
next step would be to update our application state to include this new todo
item. Before we can do that, we need to dive into action creators.

## Let's make an action creator
The reducer that we just created determines the new state based on an action
that is passed to it. These actions are typically simple objects that include a
`type` property and value as well as any additional data the reducer will need
to perform the action. An action for creating a new todo might look like this:
```
{
    type: "ADD_TODO",
    text: "Write getting started guide"
}
```

It doesn't seem very productive to type these objects out every time so the
typical flow in a redux application is to use something called action creators.
These are very simple functions that return action objects. This will give us a
nice place to expost the `type` as a constant for our reducer as well. We did
not create a generator for action creators because, as you will see, there
would be nothing to generate.

Create a new file src/actions/todos.js
```
export const ADD_TODO = "ADD_TODO";

export function addTodo (text) {
    return {
        type: ADD_TODO,
        text: text 
    };
}
```

Now let's tell our reducer what to do with this action.
Edit src/reducers/todos.js
```
import { ADD_TODO } from "../actions/todos";

const INITIAL_STATE = ["First Item", "Second Item"];

export default (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_TODO:
            return [action.text, ...state];
        default:
            return state;
    }
};
```

First we import our `ADD_TODO` constant at the top. Then we add a special case to
a switch statement for actions of that type. We then create a new array with
the todo text and copy over our old array using the ES2015 spread operator.
Take note that we create a new array, and we don't mutate the old array. This
is an important requirement of Redux as their documentation states:

> For now, just remember that the reducer must be pure. Given the same
> arguments, it should calculate the next state and return it. No surprises. No
> side effects. No API calls. No mutations. Just a calculation.

See the Redux documentation on
[Reducers](http://rackt.org/redux/docs/basics/Reducers.html) for more
information.

## Hook up our action creator
Redux sends actions to the reducers through a dispatch method that is provided
for you through the @connect decorator that GlueStick automatically sets up for
you. Redux gives you the ability to bind your action creators to the dispatcher
with it's `bindActionCreators` method. GlueStick also, sets most of this up for
you so that you only need to pass your action creators in the place where the
code says `/** _INSERT_ACTION_CREATORS_ **/`.

Let's update our Todos container so that we can pass our bound `addTodo` action
creator to the AddTodo component.

src/containers/Todos.js
```
import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import TodoList from "../components/TodoList";
// import our addTodo action creator
import { addTodo } from "../actions/todos";

@connect(
    (state) => ({todos: state.todos}),
    // bind our action creator to the dispatch method so we can pass it around
    // without worrying about how to dispatch the action to our Redux store
    (dispatch) => bindActionCreators({addTodo}, dispatch)
)
export default class Todos extends Component {
    static fetchData ({dispatch}) {}

    render () {
        // Pass the bound addTodo action creator to TodoList
        return (
            <TodoList todos={this.props.todos} addTodo={this.props.addTodo} />
        );
    }
}
```

Now that TodoList has been given the `addTodo` method, we can continue to pass
it to our AddTodo form. Edit the TodoList component like the following:

src/components/TodoList.js
```
import React, { Component, PropTypes } from "react";
import AddTodo from "./AddTodo";

export default class TodoList extends Component {
    render () {
        const todos = this.renderTodos();
        return (
            <div>
                <AddTodo addTodo={this.props.addTodo} />
                {todos}
            </div>
        );
    }

    renderTodos () {
        if (!this.props.todos) return;

        return this.props.todos.map((todo, index) => {
            return <div key={index}>{todo}</div>;
        });
    }
}
```

The only line we changed was that we changed `<AddTodo />` to `<AddTodo addTodo={this.props.addTodo} />`.

Now we can finish the AddTodo component by using the addTodo method. Edit the
file and replace our `// @TODO…` comment with `this.props.addTodo(newItem);`
```
import React, { Component, PropTypes } from "react";

export default class AddTodo extends Component {
    render () {
        return (
            <div>
                <form onSubmit={this.didSubmit}>
                    <input type="text" ref={(input) => this.input = input} />
                </form>
            </div>
        );
    }

    didSubmit = (e) => {
        e.preventDefault();
        const newItem = this.input.value;
        this.input.value = "";
        this.props.addTodo(newItem);
    }
}
```

## Asynchronous action creators
If you made it this far, you just built a todo list application using GlueStick
and the array of frameworks it glues together for you. You'll notice that
refreshing the web browser resets our list to the initial state. That is
because we haven't done anything to persist the data yet. You could keep things
in the browser by using LocalStorage or hitting a server API in your action
creators.

GlueStick gives you a couple middleware functions for your Redux store: [Redux
Thunk](https://github.com/gaearon/redux-thunk) and [our own Promise
middleware](https://github.com/TrueCar/gluestick/blob/develop/src/lib/promiseMiddleware.js).

Creating an action creator that needs to hit an API should be done with the
promise middleware. Here is an example of what that would look like:
```
function getTodos () {
    return {
        type: "GET_TODOS",
        promise: new Promise((resolve) => {
            someAsyncMethod((result) => {
                resolve(result);
            });
        })
    };
}
```

The promise middleware can fire off 3 of it's own actions. If your action type
is `GET_TODOS` then it will first dispatch `GET_TODOS_INIT`. It is up to you if
you want to handle this action or not. This is a good place to update the state
to show a loading spinner.

`GET_TODOS` will only be triggerd once the promise resolves. When you call
`resolve` from inside your promise, any value passed to the `resolve` method
will be available on the action object under as `action.value`.

`GET_TODOS_FAILURE` will be triggered if the promise fails to resolve. This
gives you the chance to notify the user that something went wrong.

## Prefetching data with `fetchData` Earlier we mentioned the static
`fetchData` method. React Router allows us to call a method before rendering a
component. In this case, all of our containers have the opportunity to let the
server and client to know if we need to fetch data before showing the component.

To use this method, simply create an action creator using the promise
middleware and return the result of dispatching that action.

Example:
```
import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import TodoList from "../components/TodoList";
import { getTodos, addTodo } from "../actions/todos";

@connect(
    (state) => ({todos: state.todos}),
    (dispatch) => bindActionCreators({addTodo}, dispatch)
)
export default class Todos extends Component {
    static fetchData ({dispatch}) {
        // It is important you `return` the result and that you pass the result of
        // `getTodos()`, not the the function itself. Lastly make sure getTodos()
        // returns an action using the promise middleware so the the dispatch method
        // returns a promise.
        return dispatch(getTodos());
    }

    render () {
        return (
            <TodoList todos={this.props.todos} addTodo={this.props.addTodo} />
        );
    }
}
```

