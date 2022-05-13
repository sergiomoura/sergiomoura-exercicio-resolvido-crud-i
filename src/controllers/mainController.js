const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const visited = products.filter(function(product){
	return product.category == 'visited'
})
const inSale = products.filter(function(product){
	return product.category == 'in-sale'
})
const controller = {
	index: (req, res) => {
		res.render('index', {
			visited,
			inSale,
			search:'',
			toThousand
		});
	},
	search: (req, res) => {
		
		// 'cai,teste,cafe' => ['cai','teste','cafe'] => ['cai','teste','cafe',search]
		// => 'cai,teste,cafe,bone'
		let buscasRealizadas;
		if(req.cookies.searches == undefined){
			buscasRealizadas = [];
		} else {
			buscasRealizadas = req.cookies.searches.split(',');
		}

		let search = req.query.keywords;
		
		buscasRealizadas.push(search);

		// Enviando um cookie para o cliente
		res.cookie('searches',buscasRealizadas.toString());
		console.log(buscasRealizadas.toString());

		let productsToSearch = products.filter(product => product.name.toLowerCase().includes(search));
		
		
		res.render('results', { 
			products: productsToSearch, 
			search,
			toThousand,
		});
	},
};

module.exports = controller;
