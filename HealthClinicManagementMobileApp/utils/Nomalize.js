const Nomalize = {
    nameNormalize: (name) => {
        name = name.trim().replace(/\s+/g, ' ');
        name = name.replace(/[^A-Za-zÀ-Ỹà-ỹ\s]/g, '');
        name = name.toLowerCase();
        const words = name.split(' ');
        const normalizedWords = words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return normalizedWords.join(' ');
    }
}

export default Nomalize;
