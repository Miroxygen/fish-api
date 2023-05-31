import { FishCatch } from '../models/fishModel.js'

/**
 * Adds static data for the database for testing purposes.
 */
export class TestDataManager {
  /**
   * Populates the DB with static data.
   */
  async populateTestData () {
    try {
      const data = [
        {
          fish_id: 17,
          catcher: 'John Doe',
          position: '[48.8583701, 2.2922926]',
          waterBodyName: 'River Seine',
          city: 'Paris',
          species: 'Trout',
          weight: '1.5',
          length: '35',
          imageUrl: 'https://example.com/trout.jpg',
          catchTimestamp: new Date('2023-03-31T10:30:00Z')
        },
        {
          fish_id: 18,
          catcher: 'Jane Smith',
          position: '[51.5073509, -0.1277583]',
          waterBodyName: 'Thames River',
          city: 'London',
          species: 'Salmon',
          weight: '2.0',
          length: '45',
          imageUrl: 'https://example.com/salmon.jpg',
          catchTimestamp: new Date('2023-03-30T15:45:00Z')
        },
        {
          fish_id: 19,
          catcher: 'Bob Johnson',
          position: '[40.7127753, -74.0059728]',
          waterBodyName: 'Hudson River',
          city: 'New York',
          species: 'Bass',
          weight: '3.2',
          length: '60',
          imageUrl: 'https://example.com/bass.jpg',
          catchTimestamp: new Date('2023-03-29T09:15:00Z')
        }
      ]

      await FishCatch.insertMany(data)
      console.log('Test data inserted successfully')
    } catch (err) {
      console.error('Error inserting test data:', err)
    }
  }

  /**
   * Removes the data on serverexit.
   */
  static async removeTestData () {
    try {
      await FishCatch.deleteMany({})
      console.log('Test data removed successfully')
    } catch (err) {
      console.error('Error removing test data:', err)
    }
  }
}
