const Normalize = {
    nameNormalize: (name) => {
        name = name.trim().replace(/\s+/g, ' ');
        name = name.replace(/[^A-Za-zÀ-Ỹà-ỹ\s]/g, '');
        name = name.toLowerCase();
        const words = name.split(' ');
        const normalizedWords = words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return normalizedWords.join(' ');
    },
    capitalizeFirstLetter: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
}

export default Normalize;
