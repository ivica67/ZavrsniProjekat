// Dohvatanje HTML elemenata

var nova_igra = document.getElementById('nova_igra');
var vreme = document.getElementById('vreme');
var tabla = document.getElementById('tabla');

nova_igra.addEventListener('click', novaIgra); // Kliknuto je dugme, poziva se funkcija novaIgra

nova_igra.disabled = false; // Dugme za pocetak igre je omoguceno

// Matrica koja predstavlja raspored kartica, elementi matrice su 0 ako je polje prazno,
// brojevi od 1 do 8 su redni brojevi kartica koje ce se naci na poljima
var matrica;

// Promenljive koje cuvaju elemente koji predstavljaju prvu i drugu odabranu karticu
var prva_kartica;
var druga_kartica;

var igra_u_toku = 0; // Indikator koji oznacava da li je igra u toku
var dozvoljen_potez = 0; // Indikator koji odredjuje da li je dozvoljeno okretanje kartica

var preostalo_polja; // Promenljiva koja cuva broj koliko je polja ostalo neotvoreno
var preostalo_vreme = 55; // Promenljiva koja cuva preostali broj sekundi do kraja igre

vreme.innerHTML = preostalo_vreme;


function novaIgra() {
	// Inicijalizacija parametara igre
	preostalo_polja = 16;
	dozvoljen_potez = 1;
	
	nova_igra.disabled = true;
	igra_u_toku = 1;
	preostalo_vreme = 55;

	// Indikator da vrednost nije dodeljena
	prva_kartica = undefined;
	druga_kartica = undefined;

	inicijalizujMatricu();	

	nacrtajTablu();

	pokreniTajmer();
}


// Funkcija zaduzena za racunanje i prikaz vremena
function pokreniTajmer()
{
	// Ako je igra zavrsena, tajmer se zaustavlja
	if(igra_u_toku == 0)
		return;

	// Preostalo vreme do kraja igre se upisuje kao sadrzaj elementa <strong id="vreme"></strong> 
	vreme.innerHTML = preostalo_vreme;

	// Ako vreme nije isteklo
	if(preostalo_vreme != 0)
	{
		preostalo_vreme--; // Smanjuje broj sekundi do kraja

		// Pozivamo funkciju koja odbrojava vreme do kraja svakih 1000 ms = 1s.
		setTimeout(pokreniTajmer, 1000); 
	}
	else // Ako je vreme isteklo
	{
		alert("ISTEKLO VREME");
		igra_u_toku = 0;
		nova_igra.disabled = false;
	}
}


// Funkcija koja crta tablu sa karticama
function nacrtajTablu()
{
	var i, j; 	// Brojaci

	tabla.innerHTML = ""; // Brisanje table

	// Tabla se popunjava karticama
	for(i = 0; i < 4; i++)
	{
		for(j = 0; j < 4; j++)
		{

			// Pravljenje novog elementa div sa klasom polje
			polje = document.createElement('div');
			polje.setAttribute('class', 'polje');

			// Pravljenje novog elementa img sa vrednostima atributa:
			// src="images/back.png", data-okrenuta="0" data-broj="Element matrice na poziciji i,j."
			// atribut data-okrenuta cuva informaciju da li je kartica okrenuta (1) ili nije (0).
			// atribut data-broj cuva informaciju o broju kartice koja se nalazi na toj poziciji
			kartica = document.createElement('img');
			kartica.setAttribute('src', 'images/back.png');
			kartica.setAttribute('data-okrenuta', 0);
			kartica.setAttribute('data-broj', matrica[i][j]);

			// Zadavanje CSS svojstva transition na 0.3s
			kartica.style.transition = '0.3s';

			// Dodavanje dogadjaja vezanih za kartice
			kartica.addEventListener('click', okreniKarticu); // Klik na karticu
			kartica.addEventListener('mouseover', prikaziSenku); // Prelaz kursora preko kartice
			kartica.addEventListener('mouseleave', skloniSenku); // Izlazak kursora sa kartice


			// Elementu div sa klasom polje dodeljujemo dete cvor sa slikom
			polje.appendChild(kartica);

			// Dodajemo div sa karticom elementu tabla.
			tabla.appendChild(polje);
		}
	}
}

// Funkcija kojom se obradjuje odabir kartice
function okreniKarticu()
{
	// Karticu je moguce okrenuti ako je igra u toku, okretanje dozvoljeno i ako jos nije okrenuta
	if(igra_u_toku == 1 && dozvoljen_potez == 1 && this.getAttribute('data-okrenuta') == 0)
	{
		// Postavlja se odgovarajuca slika kartice i indikator da je okrenuta
		this.setAttribute('src', 'images/'+this.getAttribute('data-broj')+'.png');
		this.setAttribute('data-okrenuta', 1);

		// Ako jos nije izabrana prva kartica...
		if(prva_kartica == undefined)
		{
			prva_kartica = this; // Postavlja se vrednost na element koji je pozvao funkciju
			// - na karticu za koju je registrovan klik (this)
		}
		else // Ako je izabrana prva kartica, a druga nije
		{
			druga_kartica = this;

			// Ako su kartice iste 
			if(prva_kartica.getAttribute('data-broj') == druga_kartica.getAttribute('data-broj'))
			{
				// Deselektovanje kartica
				prva_kartica = undefined;
				druga_kartica = undefined;

				preostalo_polja -= 2;

				// Ako nema vise neotvorenih polja na tabli igra je zavrsena
				if(preostalo_polja == 0)
				{
					alert("ČESTITAMO!");
					igra_u_toku = 0;
					nova_igra.disabled = false;
				}
			}
			else // U odabranom paru kartice nisu iste
			{
				dozvoljen_potez = 0; // Onesposobljava se klik na ostale kartice
				setTimeout(function(){ // Postavlja se tajmer na 1s nakon cega se neuparene kartice ponovo okrecu
					
					// Okretanje kartica na skrivene
					prva_kartica.setAttribute('data-okrenuta', 0);
					druga_kartica.setAttribute('data-okrenuta', 0);

					// Postavljanje slike poledjine kartica
					prva_kartica.setAttribute('src', 'images/back.png');
					druga_kartica.setAttribute('src', 'images/back.png');

					// Deselektovanje kartica
					prva_kartica = undefined;
					druga_kartica = undefined;
					dozvoljen_potez = 1;

				}, 1000);
			}
		}
	}
}


// Inicijalizacija matrice sa rasporedom kartica
function inicijalizujMatricu()
{
	// Definisanje niza
	matrica = new Array()

	for(i = 0; i < 4; i++)
	{
		matrica[i] = []; // Za i-ti element niza navodimo da je i on novi niz (niz nizova)

		for(j = 0; j < 4; j++)
		{
			matrica[i][j] = 0; // Inicijalizacija svih polja matrice na 0
		}
	}

	var i1, j1, i2, j2;

	// Smestanje kartica od 1 do 8 na po dva prazna polja na tabli
	for(var k = 1; k <= 8; k++)
	{
		do // Pronalazenje prvog slobodnog polja
		{
			// koordinata i
			i1 = Math.random(); // Generisanje slucajnog broja izmedju 0 i 1
			i1 = Math.trunc(i1 * 100) % 4; // Dobijanje celog broja od 0 do 3

			// koordinata j
			j1 = Math.random();
			j1 = Math.trunc(j1 * 100) % 4;

		} while(matrica[i1][j1] != 0) // Sve dok se ne pronadju koordinate slobodnog polja

		matrica[i1][j1] = k; // Postavljanje kartice k na polje sa koordinatama (i1, j1)

		do // Pronalazenje drugog slobodnog polja
		{
			i2 = Math.random();
			i2 = Math.trunc(i2 * 100) % 4;

			j2 = Math.random();
			j2 = Math.trunc(j2 * 100) % 4;

		} while(matrica[i2][j2] != 0)

		matrica[i2][j2] = k;
	}
}

// Postavljanje senke na kartici
function prikaziSenku() {
	this.style.boxShadow = '0px 0px 15px 3px black';
}

// Uklanjanje senke na kartici
function skloniSenku(){
	this.style.boxShadow = 'none';
}