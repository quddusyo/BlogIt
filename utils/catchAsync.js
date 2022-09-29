// return a function which takes in a function, executes it and catches any errors to
// next (we can use this one all async functions without repeating try/catch block)
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}