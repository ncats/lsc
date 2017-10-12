/* Npm can modify latest-version to be different than what's in package.json
 This function "corrects" a version and can be used both with local version and
 latest version */

export function correctVersion(version: string) {
    return version.replace(/[a-zA-Z]/g, '').split('.').map(n => parseInt(n, 10)).join('.')
}
