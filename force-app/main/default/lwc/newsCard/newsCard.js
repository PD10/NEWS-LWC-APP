import { LightningElement, api } from 'lwc';

export default class NewsCard extends LightningElement {
    @api newsItem;
}