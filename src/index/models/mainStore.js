import {observable, action} from 'mobx';

class MainStoreClass {
    @observable dataSource = [];
    @action handleOP(item, op, callback){
        item.tag = this.constructorData(item.tag);
        const tagKeys = Object.keys(item.tag);
        const tagObj = [];
        tagKeys.forEach(key => {
            tagObj.push({tagLabel: key, tagValue: item.tag[key]});
        });
        item.tag = tagObj;
        item.key = item.id;
        if(op === 'add'){
            this.dataSource.push(item);
        }else {
            this.dataSource.forEach((data, index) => {
                if(data.id === item.id){
                    this.dataSource.splice(index, 1, item);
                }
            });
        }
        if(callback){
            callback();
        }
    }
    constructorData(data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }
    @action handleDelete(item){
        this.dataSource.forEach((data, index) => {
            if(data.id === item.id){
                this.dataSource.splice(index, 1);
            }
        });
    }
}
const mainStore = new MainStoreClass();

export default mainStore;
