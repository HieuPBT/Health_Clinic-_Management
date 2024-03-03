const formatDate = (date)=>{
    console.log(date)
    const parts = date.split('/');
    const year = parts[2];
    const month = parts[1];
    const day = parts[0];

    return `${year}-${month}-${day}`;
}

export default formatDate;
