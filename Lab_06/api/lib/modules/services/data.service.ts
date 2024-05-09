import {IData, Query} from "../models/data.model";
import PostModel from '../schemas/data.schema';

class DataService {
   public async createPost(postParams: IData) {
       try {
           const dataModel = new PostModel(postParams);
           await dataModel.save();
       } catch (error) {
           console.error('Wystąpił błąd podczas tworzenia danych:', error);
           throw new Error('Wystąpił błąd podczas tworzenia danych');
       }
   }

   public async query(query: Query<number | string | boolean>) {
       try {
           const result = await PostModel.find(query, { __v: 0, _id: 0 });
           return result;
       } catch (error) {
           throw new Error(`Query failed: ${error}`);
       }
   }

   public async deleteData(query: Query<number | string | boolean>) {
       try {
           await PostModel.deleteMany(query);
       } catch (error) {
           console.error('Wystąpił błąd podczas usuwania danych:', error);
           throw new Error('Wystąpił błąd podczas usuwania danych');
       }
   }

      public async getById(id: string) {
         try {
             const result = await PostModel.findById(id);
             return result;
         } catch (error) {
             throw new Error(`Error getting data by ID: ${error}`);
         }
     }

     public async deleteById(id: string) {
         try {
             await PostModel.findByIdAndDelete(id);
         } catch (error) {
             console.error('Wystąpił błąd podczas usuwania danych:', error);
             throw new Error('Wystąpił błąd podczas usuwania danych');
         }
     }

     public async deleteAllPosts() {
         try {
             await PostModel.deleteMany({});
         } catch (error) {
             console.error('Wystąpił błąd podczas usuwania wszystkich danych:', error);
             throw new Error('Wystąpił błąd podczas usuwania wszystkich danych');
         }
     }

}

export default DataService;