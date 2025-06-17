import { Bid } from '../models/types';
import { currentBids } from '../data/mockData';
import { supabase } from '@/integrations/supabase/client';

// Local storage for bids - in a real app this would be a database
let bids = [...currentBids];

// Helper function to ensure status is of the correct type
const validateBidStatus = (status: string): 'Pending' | 'Approved' | 'Rejected' | 'Confirmed' => {
  if (status === 'Pending' || status === 'Approved' || status === 'Rejected' || status === 'Confirmed') {
    return status;
  }
  return 'Pending'; // Default to Pending for invalid values
};

// Helper function to convert database record to Bid type
const mapDbBidToBid = (dbBid: any): Bid => {
  return {
    id: String(dbBid.id),
    shiftId: String(dbBid.shift_id),
    employeeId: String(dbBid.employee_id),
    status: validateBidStatus(dbBid.status),
    createdAt: dbBid.created_at || new Date().toISOString(),
    notes: dbBid.notes || ''
  };
};

export const bidService = {
  getAllBids: async (): Promise<Bid[]> => {
    try {
      // Direct table access with type assertion
      const { data, error } = await supabase
        .from('bids')
        .select('*');
      
      if (error) {
        console.error('Error fetching bids from Supabase:', error);
        return Promise.resolve(bids);
      }
      
      // Map Supabase data to our Bid model
      if (data && data.length > 0) {
        return data.map(mapDbBidToBid);
      }
      
      // Fall back to mock data
      return Promise.resolve(bids);
    } catch (e) {
      console.error('Error in getAllBids:', e);
      return Promise.resolve(bids);
    }
  },
  
  getBidById: async (id: string): Promise<Bid | null> => {
    try {
      // First try to get bid from Supabase
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('id', parseInt(id, 10))
        .single();
      
      if (error) {
        console.error(`Error fetching bid with ID ${id} from Supabase:`, error);
        // Fall back to mock data
        const bid = bids.find(b => b.id === id);
        return Promise.resolve(bid || null);
      }
      
      // Map Supabase data to our Bid model
      if (data) {
        return mapDbBidToBid(data);
      }
      
      // Fall back to mock data
      const bid = bids.find(b => b.id === id);
      return Promise.resolve(bid || null);
    } catch (e) {
      console.error(`Error in getBidById for ID ${id}:`, e);
      // Fall back to mock data
      const bid = bids.find(b => b.id === id);
      return Promise.resolve(bid || null);
    }
  },
  
  getBidsByEmployee: async (employeeId: string): Promise<Bid[]> => {
    try {
      // First try to get bids from Supabase
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('employee_id', parseInt(employeeId, 10));
      
      if (error) {
        console.error(`Error fetching bids for employee ${employeeId} from Supabase:`, error);
        // Fall back to filtering mock data
        const employeeBids = bids.filter(b => b.employeeId === employeeId);
        return Promise.resolve(employeeBids);
      }
      
      // Map Supabase data to our Bid model
      if (data && data.length > 0) {
        return data.map(mapDbBidToBid);
      }
      
      // Fall back to filtering mock data
      const employeeBids = bids.filter(b => b.employeeId === employeeId);
      return Promise.resolve(employeeBids);
    } catch (e) {
      console.error(`Error in getBidsByEmployee for employee ${employeeId}:`, e);
      // Fall back to filtering mock data
      const employeeBids = bids.filter(b => b.employeeId === employeeId);
      return Promise.resolve(employeeBids);
    }
  },
  
  getBidsForShift: async (shiftId: string): Promise<Bid[]> => {
    try {
      // First try to get bids from Supabase
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('shift_id', parseInt(shiftId, 10));
      
      if (error) {
        console.error(`Error fetching bids for shift ${shiftId} from Supabase:`, error);
        // Fall back to filtering mock data
        const shiftBids = bids.filter(b => b.shiftId === shiftId);
        return Promise.resolve(shiftBids);
      }
      
      // Map Supabase data to our Bid model
      if (data && data.length > 0) {
        return data.map(mapDbBidToBid);
      }
      
      // Fall back to filtering mock data
      const shiftBids = bids.filter(b => b.shiftId === shiftId);
      return Promise.resolve(shiftBids);
    } catch (e) {
      console.error(`Error in getBidsForShift for shift ${shiftId}:`, e);
      // Fall back to filtering mock data
      const shiftBids = bids.filter(b => b.shiftId === shiftId);
      return Promise.resolve(shiftBids);
    }
  },
  
  createBid: async (bid: Omit<Bid, 'id' | 'createdAt'>): Promise<Bid> => {
    try {
      // Create the properly typed bid data object
      const newBidData = {
        shift_id: parseInt(bid.shiftId, 10),
        employee_id: parseInt(bid.employeeId, 10),
        status: bid.status || 'Pending',
        notes: bid.notes || undefined
      };

      // First try to insert bid into Supabase
      const { data, error } = await supabase
        .from('bids')
        .insert(newBidData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating bid in Supabase:', error);
        // Fall back to mock data insertion
        const newBid: Bid = {
          ...bid,
          id: `bid-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        
        bids.push(newBid);
        return Promise.resolve(newBid);
      }
      
      // Map Supabase data to our Bid model
      if (data) {
        const newBid = mapDbBidToBid(data);
        
        // Update mock data to keep it in sync
        bids.push(newBid);
        
        return Promise.resolve(newBid);
      }
      
      // Fall back to mock data insertion
      const newBid: Bid = {
        ...bid,
        id: `bid-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      bids.push(newBid);
      return Promise.resolve(newBid);
    } catch (e) {
      console.error('Error in createBid:', e);
      // Fall back to mock data insertion
      const newBid: Bid = {
        ...bid,
        id: `bid-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      bids.push(newBid);
      return Promise.resolve(newBid);
    }
  },
  
  updateBidStatus: async (id: string, status: 'Pending' | 'Approved' | 'Rejected' | 'Confirmed'): Promise<Bid | null> => {
    try {
      // First try to update bid in Supabase
      const { data, error } = await supabase
        .from('bids')
        .update({ status })
        .eq('id', parseInt(id, 10))
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating bid with ID ${id} in Supabase:`, error);
        // Fall back to mock data update
        const index = bids.findIndex(b => b.id === id);
        if (index === -1) return Promise.resolve(null);
        
        const updatedBid = {
          ...bids[index],
          status
        };
        
        bids[index] = updatedBid;
        
        // If a shift is offered (approved), reject all other bids for this shift
        if (status === 'Approved') {
          const shiftId = updatedBid.shiftId;
          
          // Find all other pending bids for the same shift
          const otherBidsForShiftIndexes = bids.reduce((indexes: number[], bid, idx) => {
            if (bid.shiftId === shiftId && bid.id !== id && bid.status === 'Pending') {
              indexes.push(idx);
            }
            return indexes;
          }, []);
          
          // Reject all other pending bids
          otherBidsForShiftIndexes.forEach(idx => {
            bids[idx] = {
              ...bids[idx],
              status: 'Rejected',
              notes: 'Shift offered to another employee'
            };
          });
        }
        
        return Promise.resolve(updatedBid);
      }
      
      // Map Supabase data to our Bid model
      if (data) {
        const updatedBid = mapDbBidToBid(data);
        
        // Update mock data to keep it in sync
        const index = bids.findIndex(b => b.id === id);
        if (index !== -1) {
          bids[index] = updatedBid;
        }
        
        // If a shift is offered (approved), reject all other bids for this shift in Supabase
        if (status === 'Approved') {
          const shiftId = updatedBid.shiftId;
          
          // Update other pending bids for the same shift in Supabase
          supabase
            .from('bids')
            .update({
              status: 'Rejected', 
              notes: 'Shift offered to another employee'
            })
            .eq('shift_id', parseInt(shiftId, 10))
            .neq('id', parseInt(id, 10))
            .eq('status', 'Pending')
            .then(({ error }) => {
              if (error) {
                console.error('Error rejecting other bids in Supabase:', error);
                
                // Update mock data to keep it in sync
                const otherBidsForShiftIndexes = bids.reduce((indexes: number[], bid, idx) => {
                  if (bid.shiftId === shiftId && bid.id !== id && bid.status === 'Pending') {
                    indexes.push(idx);
                  }
                  return indexes;
                }, []);
                
                otherBidsForShiftIndexes.forEach(idx => {
                  bids[idx] = {
                    ...bids[idx],
                    status: 'Rejected',
                    notes: 'Shift offered to another employee'
                  };
                });
              }
            });
        }
        
        return Promise.resolve(updatedBid);
      }
      
      // Fall back to mock data update
      const index = bids.findIndex(b => b.id === id);
      if (index === -1) return Promise.resolve(null);
      
      const updatedBid = {
        ...bids[index],
        status
      };
      
      bids[index] = updatedBid;
      
      // If a shift is offered (approved), reject all other bids for this shift
      if (status === 'Approved') {
        const shiftId = updatedBid.shiftId;
        
        // Find all other pending bids for the same shift
        const otherBidsForShiftIndexes = bids.reduce((indexes: number[], bid, idx) => {
          if (bid.shiftId === shiftId && bid.id !== id && bid.status === 'Pending') {
            indexes.push(idx);
          }
          return indexes;
        }, []);
        
        // Reject all other pending bids
        otherBidsForShiftIndexes.forEach(idx => {
          bids[idx] = {
            ...bids[idx],
            status: 'Rejected',
            notes: 'Shift offered to another employee'
          };
        });
      }
      
      return Promise.resolve(updatedBid);
    } catch (e) {
      console.error(`Error in updateBidStatus for ID ${id}:`, e);
      // Fall back to mock data update
      const index = bids.findIndex(b => b.id === id);
      if (index === -1) return Promise.resolve(null);
      
      const updatedBid = {
        ...bids[index],
        status
      };
      
      bids[index] = updatedBid;
      
      // If a shift is offered (approved), reject all other bids for this shift
      if (status === 'Approved') {
        const shiftId = updatedBid.shiftId;
        
        // Find all other pending bids for the same shift
        const otherBidsForShiftIndexes = bids.reduce((indexes: number[], bid, idx) => {
          if (bid.shiftId === shiftId && bid.id !== id && bid.status === 'Pending') {
            indexes.push(idx);
          }
          return indexes;
        }, []);
        
        // Reject all other pending bids
        otherBidsForShiftIndexes.forEach(idx => {
          bids[idx] = {
            ...bids[idx],
            status: 'Rejected',
            notes: 'Shift offered to another employee'
          };
        });
      }
      
      return Promise.resolve(updatedBid);
    }
  },
  
  // New methods for bulk operations
  updateBulkBidStatus: async (ids: string[], status: 'Pending' | 'Approved' | 'Rejected' | 'Confirmed'): Promise<Bid[]> => {
    try {
      // First try to update bids in Supabase
      const promises = ids.map(id => 
        supabase
          .from('bids')
          .update({ status })
          .eq('id', parseInt(id, 10))
          .select()
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter((r: any) => r.error);
      
      if (errors.length > 0) {
        console.error('Error updating bulk bids in Supabase:', errors);
        // Fall back to mock data update
        const updatedBids: Bid[] = [];
        
        ids.forEach(id => {
          const index = bids.findIndex(b => b.id === id);
          if (index !== -1) {
            const updatedBid = {
              ...bids[index],
              status
            };
            
            bids[index] = updatedBid;
            updatedBids.push(updatedBid);
          }
        });
        
        return Promise.resolve(updatedBids);
      }
      
      // Map Supabase data to our Bid model
      const updatedBids: Bid[] = [];
      results.forEach((result: any) => {
        if (result.data && result.data.length > 0) {
          const data = result.data[0];
          const updatedBid = mapDbBidToBid(data);
          
          // Update mock data to keep it in sync
          const index = bids.findIndex(b => b.id === updatedBid.id);
          if (index !== -1) {
            bids[index] = updatedBid;
          }
          
          updatedBids.push(updatedBid);
        }
      });
      
      if (updatedBids.length > 0) {
        return Promise.resolve(updatedBids);
      }
      
      // Fall back to mock data update
      const mockedUpdatedBids: Bid[] = [];
      
      ids.forEach(id => {
        const index = bids.findIndex(b => b.id === id);
        if (index !== -1) {
          const updatedBid = {
            ...bids[index],
            status
          };
          
          bids[index] = updatedBid;
          mockedUpdatedBids.push(updatedBid);
        }
      });
      
      return Promise.resolve(mockedUpdatedBids);
    } catch (e) {
      console.error('Error in updateBulkBidStatus:', e);
      // Fall back to mock data update
      const updatedBids: Bid[] = [];
      
      ids.forEach(id => {
        const index = bids.findIndex(b => b.id === id);
        if (index !== -1) {
          const updatedBid = {
            ...bids[index],
            status
          };
          
          bids[index] = updatedBid;
          updatedBids.push(updatedBid);
        }
      });
      
      return Promise.resolve(updatedBids);
    }
  },
  
  addNotesToBid: async (id: string, notes: string): Promise<Bid | null> => {
    try {
      // First try to update bid in Supabase
      const updateData = { notes };
      
      const { data, error } = await supabase
        .from('bids')
        .update(updateData)
        .eq('id', parseInt(id, 10))
        .select()
        .single();
      
      if (error) {
        console.error(`Error adding notes to bid with ID ${id} in Supabase:`, error);
        // Fall back to mock data update
        const index = bids.findIndex(b => b.id === id);
        if (index === -1) return Promise.resolve(null);
        
        const updatedBid = {
          ...bids[index],
          notes
        };
        
        bids[index] = updatedBid;
        return Promise.resolve(updatedBid);
      }
      
      // Map Supabase data to our Bid model
      if (data) {
        const updatedBid = mapDbBidToBid(data);
        
        // Update mock data to keep it in sync
        const index = bids.findIndex(b => b.id === id);
        if (index !== -1) {
          bids[index] = updatedBid;
        }
        
        return Promise.resolve(updatedBid);
      }
      
      // Fall back to mock data update
      const index = bids.findIndex(b => b.id === id);
      if (index === -1) return Promise.resolve(null);
      
      const updatedBid = {
        ...bids[index],
        notes
      };
      
      bids[index] = updatedBid;
      return Promise.resolve(updatedBid);
    } catch (e) {
      console.error(`Error in addNotesToBid for ID ${id}:`, e);
      // Fall back to mock data update
      const index = bids.findIndex(b => b.id === id);
      if (index === -1) return Promise.resolve(null);
      
      const updatedBid = {
        ...bids[index],
        notes
      };
      
      bids[index] = updatedBid;
      return Promise.resolve(updatedBid);
    }
  },
  
  // New method to withdraw a bid
  withdrawBid: async (id: string): Promise<boolean> => {
    try {
      // First try to delete bid in Supabase
      const { error } = await supabase
        .from('bids')
        .delete()
        .eq('id', parseInt(id, 10));
      
      if (error) {
        console.error(`Error withdrawing bid with ID ${id} in Supabase:`, error);
        // Fall back to mock data update
        const index = bids.findIndex(b => b.id === id);
        if (index === -1) return Promise.resolve(false);
        
        bids.splice(index, 1);
        return Promise.resolve(true);
      }
      
      // Update mock data to keep it in sync
      const index = bids.findIndex(b => b.id === id);
      if (index !== -1) {
        bids.splice(index, 1);
      }
      
      return Promise.resolve(true);
    } catch (e) {
      console.error(`Error in withdrawBid for ID ${id}:`, e);
      // Fall back to mock data update
      const index = bids.findIndex(b => b.id === id);
      if (index === -1) return Promise.resolve(false);
      
      bids.splice(index, 1);
      return Promise.resolve(true);
    }
  }
};
