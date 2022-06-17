import { LightningElement, track } from 'lwc';
import getTopHeadlineNews from '@salesforce/apex/NewsController.getTopHeadlineNews';

export default class NewsComponent extends LightningElement {
    @track news;
    countryValue = 'in';
    genreValue = 'business';
    searchTerm = '';
    isSpinnerLoaded = false;
    timeout = null;

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

    connectedCallback() {
        this.fetchNews();
    }

    fetchNews() {
        this.isSpinnerLoaded = true;
        getTopHeadlineNews({ country: this.countryValue, category: this.genreValue, keyword: this.searchTerm })
            .then(response => {
                this.formatNewsData(response.articles);
                this.isSpinnerLoaded = false;
            })
            .catch(error => {
                console.log(error);
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
}