import { LightningElement } from 'lwc';
import getTopHeadlineNews from '@salesforce/apex/NewsController.getTopHeadlineNews';

export default class NewsComponent extends LightningElement {
    news;
    isThereNews;
    isThereError;
    countryValue = 'in';
    genreValue = 'business';
    searchTerm = '';
    isSpinnerLoaded = false;
    timeout = null;
    newsPerPage = 10;
    pageNumber = 1;
    totalResults;
    pages;

    countryOptions = [
        { label: 'India', value: 'in' },
        { label: 'USA', value: 'us' },
        { label: 'UK', value: 'gb' },
    ];

    genreOptions = [
        { label: 'Business', value: 'business' },
        { label: 'Entertainment', value: 'entertainment' },
        { label: 'General', value: 'general' },
        { label: 'Health', value: 'health' },
        { label: 'Science', value: 'science' },
        { label: 'Sports', value: 'sports' },
        { label: 'Technology', value: 'technology' },
    ];

    newsPerPageOptions = [
        { label: '10', value: 10 },
        { label: '20', value: 20 },
        { label: '30', value: 30 },
        { label: '40', value: 40 },
        { label: '50', value: 50 },
        { label: '60', value: 60 },
        { label: '70', value: 70 },
        { label: '80', value: 80 },
        { label: '90', value: 90 },
        { label: '100', value: 100 },
    ]

    get pageNumberOptions() {
        let pageNumbers = [];
        for(let i = 0; i < this.pages; i++) {
            pageNumbers.push(
                { label: `${i+1}`, value: i+1 }
            );
        }
        return pageNumbers;
    }

    connectedCallback() {
        this.pageNumber = 1;
        this.fetchNews();
    }

    fetchNews() {
        this.isSpinnerLoaded = true;
        getTopHeadlineNews({ country: this.countryValue, category: this.genreValue, keyword: this.searchTerm, pageSize: this.newsPerPage, page: this.pageNumber })
            .then(response => {
                this.totalResults = response.totalResults;
                this.pages = Math.ceil(response.totalResults / this.newsPerPage);
                if(response.articles.length === 0) {
                    this.isThereNews = false;
                } else {
                    this.isThereNews = true;
                    this.formatNewsData(response.articles);
                }
                this.isThereError = false;
                this.isSpinnerLoaded = false;
            })
            .catch(error => {
                console.log(error);
                this.isThereError = true;
                this.isSpinnerLoaded = false;
            })
    }

    formatNewsData(response){
        this.news = response.map((item, index)=>{
            let id = `newsItem_${index+1}`;
            let date = new Date(item.publishedAt).toDateString()
            let name = item.source.name;
            return { ...item, id: id, name: name, date: date };
        })
    }

    handleCountryChange(event) {
        this.countryValue = event.detail.value;
        this.fetchNews();
    }

    handleGenreChange(event) {
        this.genreValue = event.detail.value;
        this.fetchNews();
    }

    handleSearchChange(event) {
        this.searchTerm = event.target.value;
        clearTimeout(this.timeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.timeout = setTimeout(() => {
            this.fetchNews();
        }, 1000);
    }

    handleNewsPerPageChange(event) {
        this.newsPerPage = +event.detail.value;
        this.fetchNews();
    }

    handlePageChange(event) {
        this.pageNumber = +event.detail.value;
        this.fetchNews();
    }
}