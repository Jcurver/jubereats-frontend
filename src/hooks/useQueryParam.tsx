export const useQueryParams = (string: string) => {
	const [_, code] = window.location.href.split(`${string}=`);
	return code;
};
