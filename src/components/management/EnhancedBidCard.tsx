
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, MapPin, Calendar, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BidWithEmployee } from './types/bid-types';

interface EnhancedBidCardProps {
  bid: BidWithEmployee;
  isExpanded: boolean;
  onToggleExpand: () => void;
  applicants: BidWithEmployee[];
  onOfferShift: (bid: BidWithEmployee) => void;
  className?: string;
}

const EnhancedBidCard: React.FC<EnhancedBidCardProps> = ({
  bid,
  isExpanded,
  onToggleExpand,
  applicants,
  onOfferShift,
  className
}) => {
  const shiftDetails = bid.shiftDetails;
  
  if (!shiftDetails) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'status-open';
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'filled': return 'status-filled';
      default: return 'status-open';
    }
  };

  const getPriorityColor = (applicantCount: number) => {
    if (applicantCount >= 5) return 'text-green-600 dark:text-green-400';
    if (applicantCount >= 2) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("lovable-fade-in", className)}
    >
      <Card className="bid-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Badge className={cn("status-badge", getStatusBadgeVariant(shiftDetails.status))}>
                  {shiftDetails.status}
                </Badge>
                {shiftDetails.isDraft && (
                  <Badge variant="outline" className="text-xs">
                    Draft
                  </Badge>
                )}
              </div>
              <div className="h-4 w-px bg-border/50" />
              <span className="text-sm font-medium text-foreground">
                {shiftDetails.role}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={cn("flex items-center gap-1 text-sm font-medium", getPriorityColor(applicants.length))}>
                <Users className="h-4 w-4" />
                <span>{applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(shiftDetails.date).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{shiftDetails.startTime} - {shiftDetails.endTime}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{shiftDetails.department}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4" />
              <span>{shiftDetails.netLength}h</span>
            </div>
          </div>

          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border/30 pt-4 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Sub-department:</span>
                  <span className="ml-2 text-foreground">{shiftDetails.subDepartment || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Remuneration Level:</span>
                  <span className="ml-2 text-foreground">{shiftDetails.remunerationLevel}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Shift ID:</span>
                  <span className="ml-2 text-foreground font-mono">{shiftDetails.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <span className="ml-2 text-foreground">{new Date(bid.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {applicants.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Applicants</h4>
                  <div className="space-y-2">
                    {applicants.slice(0, 3).map((applicant) => (
                      <div
                        key={applicant.id}
                        className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {applicant.employee?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {applicant.employee?.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Tier {applicant.employee?.tier || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => onOfferShift(applicant)}
                          className="lovable-btn-primary h-8 px-3 text-xs"
                        >
                          Offer Shift
                        </Button>
                      </div>
                    ))}
                    
                    {applicants.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{applicants.length - 3} more applicant{applicants.length - 3 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedBidCard;
