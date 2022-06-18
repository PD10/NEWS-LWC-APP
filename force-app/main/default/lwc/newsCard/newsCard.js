import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class NewsCard extends NavigationMixin(LightningElement) {
    @api newsItem;

    navigateToWebPage() {
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
                "url": this.newsItem.url
            }
        });
    }
}