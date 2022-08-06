import { includesCaseInsensitive } from '@voyage-app/shared-utils'

declare global {
	interface String {
		contains(this: string, str : string) : boolean;
	}
}

String.prototype.contains = includesCaseInsensitive;