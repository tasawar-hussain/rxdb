/**
 * get a random string which can be used with couchdb
 * @link http://stackoverflow.com/a/1349426/3443137
 */
export function randomCouchString(length: number = 10): string {
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}


/**
 * A random string that is never inside of any storage
 */
export const RANDOM_STRING = 'Fz7SZXPmYJujkzjY1rpXWvlWBqoGAfAX';

/**
 * uppercase first char
 */
export function ucfirst(str: string): string {
    str += '';
    const f = str.charAt(0)
        .toUpperCase();
    return f + str.substr(1);
}

/**
 * removes trailing and ending dots from the string
 */
export function trimDots(str: string): string {
    // start
    while (str.charAt(0) === '.')
        str = str.substr(1);

    // end
    while (str.slice(-1) === '.')
        str = str.slice(0, -1);

    return str;
}

/**
 * returns true if the given name is likely a folder path
 */
export function isFolderPath(name: string) {
    // do not check, if foldername is given
    if (
        name.includes('/') || // unix
        name.includes('\\') // windows
    ) {
        return true;
    } else {
        return false;
    }
}
