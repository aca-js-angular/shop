
const vendors = [
    {img: 'assets/vendors/vendor1.jpg' , fullName: 'Gerard Mallet', country: 'France', city: 'florence', rating: '6/10', email: 'mallet1961@yahoo.com' },
    {img: 'assets/vendors/vendor2.jpg' , fullName: 'Alissa Cambel', country: 'England', city: 'toronto', rating: '8/10', email: 'alissacmb@gmail.com' },
    {img: 'assets/vendors/vendor3.jpg' , fullName: 'Naomi Wilson', country: 'USA', city: 'california', rating: '7/10', email: 'naomi333999@list.ru' },
    {img: 'assets/vendors/vendor4.jpg' , fullName: 'Lucas Sanchez', country: 'Spain', city: 'madrid', rating: '8/10', email: 'privateLCS@gmail.com' },
    {img: 'assets/vendors/vendor5.jpg' , fullName: 'Efraim Ahmed', country: 'United Arab Emirates', city: 'Dubai', rating: '9/10', email: 'efraim1955@mail.ru' },
    {img: 'assets/vendors/vendor6.jpg' , fullName: 'Yusheng Lynn', country: 'China', city: 'shanghai', rating: '4/10', email: 'nekraman119@gmail.com' },
    {img: 'assets/vendors/vendor7.jpg' , fullName: 'John Parker', country: 'USA', city: 'Ilinois', rating: '6/10', email: 'parkerj.1975@gmail.com' },
    {img: 'assets/vendors/vendor8.jpg' , fullName: 'Linda Atkinson', country: 'Holand', city: 'amsterdam', rating: '7/10', email: 'atkinson003@yahoo.com' },
    {img: 'assets/vendors/vendor9.jpg' , fullName: 'Maria Kuzminova', country: 'Russia', city: 'moscow', rating: '8/10', email: 'kuzminovamaria.1980@rambler.ru' },
    {img: 'assets/vendors/vendor10.jpg', fullName: 'Christina Watson', country: 'USA', city: 'new york', rating: '10/10', email: 'watsonofficial@gmail.com' },
    {img: 'assets/vendors/vendor11.jpg', fullName: 'Nacho Alvares', country: 'Italy', city: 'rome', rating: '5/10', email: 'alvares1961@yahoo.com' },
    {img: 'assets/vendors/vendor12.jpg', fullName: 'Alfred Muller', country: 'Germany', city: 'kholn', rating: '8/10', email: 'mulleralfred551@mail.ru' },
    {img: 'assets/vendors/vendor13.jpg', fullName: 'Rachel Mayers', country: 'England', city: 'london', rating: '7/10', email: 'mayersrachel.1978@gmail.com' },
]


function randomVendor():object {
    return vendors[randomDigit(0,12)]
}

function randomTimeStamp(): number{
    const min = new Date('2015-01-01').getTime()
    const max = Date.now()
    return generateRandom(min,max)
}


function brandCountry(brand: string): string{
    switch(brand){
        case 'Rolex': return 'Switzerland';
        case 'Patek Philippe': return 'Switzerland';
        case 'Pierre Cardin': return 'Switzerland';
        case 'Fossil': return 'USA';
        case 'Cartier': return 'France';
        case 'Ray-Ban': return 'Italy';
        case 'Bvlgari': return 'Italy';
        case 'Tiffany & Co.': return 'USA';
        case 'MVMT': return 'USA';
    }
}


function generateRandom(min: number, max: number): number{
    let x = Math.round(Math.random() * (max - min) + min)
    let y = Math.round(x / 5) * 5
    return y
}

function randomDigit(min: number,max: number): number{
    return Math.round(Math.random() * (max - min) + min)
}

function randomRating(max: number): string{
    let first = Math.round(Math.random() * max).toString()
    if(first === '0')first = '1';
    let second = max.toString()

    return first + '/' + second
}


function randomWeight(category: string): number{
    switch(category){
        case 'Watches': return generateRandom(120,350)
        case 'Sunglasses': return generateRandom(90,200)
        case 'Bracelets': return generateRandom(80,150)
        case 'Necklaces': return generateRandom(80,150)
        case 'Combo-Box': return generateRandom(500,900)
    }
}

export class P {

    name: string;
    category: string;
    price: number;
    images: string[];
    brand: string;
    rating: string;
    gender: string;
    postDate: number;
    details: {
        colors: string[];
        material: string[];
        weight: number;
        originCountry: string;
    };
    vendor: object;
    
    constructor(
        name: string,
        brand: string,
        category: string,
        price: number,
        colors: string[],
        material: string[],
        imagesQantity: number,
        gender: number,
    ){
        this.name = name;
        this.brand = brand;
        this.category = category;
        this.price = price;
        let x = []
        let imageBase = `assets/products/${this.name}/`
        for(let i = 1; i <= imagesQantity; i++){
            x.push(`${imageBase}${i}.jpg`)
        }
        this.images = x;

        this.rating = randomRating(5);

        this.postDate = randomTimeStamp()

        this.details = {
            originCountry: brandCountry(this.brand),
            weight: randomWeight(this.category),
            colors: colors,
            material: material
        }
        this.vendor = randomVendor();
        if(gender === 0)this.gender = 'men'
        else if(gender === 1)this.gender = 'women'
        else if(gender === 2)this.gender = 'unisex'
    }
}