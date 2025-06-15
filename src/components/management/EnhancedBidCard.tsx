
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

  const getPriorityLabel = (applicantCount: number) => {
    if (applicantCount >= 5) return 'High interest';
    if (applicantCount >= 2) return 'Moderate interest';
    return 'Low interest';
  };

  const expandButtonId = `expand-${bid.id}`;
  const contentId = `content-${bid.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("lovable-fade-in", className)}
    >
      <Card className="bid-card" role="article" aria-labelledby={`shift-${bid.id}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Badge 
                  className={cn("status-badge text-sm font-medium px-3 py-1", getStatusBadgeVariant(shiftDetails.status))}
                  role="status"
                  aria-label={`Shift status: ${shiftDetails.status}`}
                >
                  {shiftDetails.status}
                </Badge>
                {shiftDetails.isDraft && (
                  <Badge variant="outline" className="text-sm font-medium px-3 py-1" role="status">
                    Draft
                  </Badge>
                )}
              </div>
              <div className="h-5 w-px bg-border/50" aria-hidden="true" />
              <h3 
                id={`shift-${bid.id}`}
                className="text-lg font-semibold text-foreground"
              >
                {shiftDetails.role}
              </h3>
            </div>
            
            <div className="flex items-center gap-3">
              <div 
                className={cn("flex items-center gap-2 text-base font-medium", getPriorityColor(applicants.length))}
                role="status"
                aria-label={`${applicants.length} applicant${applicants.length !== 1 ? 's' : ''}, ${getPriorityLabel(applicants.length)}`}
              >
                <Users className="h-5 w-5" aria-hidden="true" />
                <span>{applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className="h-10 w-10 p-0 hover:bg-accent/50 transition-colors"
                aria-expanded={isExpanded}
                aria-controls={contentId}
                id={expandButtonId}
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center gap-3 text-base text-muted-foreground">
              <Calendar className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span>{new Date(shiftDetails.date).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-3 text-base text-muted-foreground">
              <Clock className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span>{shiftDetails.startTime} - {shiftDetails.endTime}</span>
            </div>
            
            <div className="flex items-center gap-3 text-base text-muted-foreground">
              <MapPin className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span>{shiftDetails.department}</span>
            </div>
            
            <div className="flex items-center gap-3 text-base text-muted-foreground">
              <Star className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span>{shiftDetails.netLength}h</span>
            </div>
          </div>

          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border/30 pt-6 space-y-6"
              id={contentId}
              role="region"
              aria-labelledby={expandButtonId}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                <div>
                  <span className="text-muted-foreground font-medium">Sub-department:</span>
                  <span className="ml-3 text-foreground">{shiftDetails.subDepartment || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Remuneration Level:</span>
                  <span className="ml-3 text-foreground">{shiftDetails.remunerationLevel}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Shift ID:</span>
                  <span className="ml-3 text-foreground font-mono text-sm">{shiftDetails.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Created:</span>
                  <span className="ml-3 text-foreground">{new Date(bid.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {applicants.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-foreground">Applicants</h4>
                  <div className="space-y-3" role="list" aria-label="Shift applicants">
                    {applicants.slice(0, 3).map((applicant) => (
                      <div
                        key={applicant.id}
                        className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/20 hover:bg-card/70 transition-colors"
                        role="listitem"
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center"
                            aria-hidden="true"
                          >
                            <span className="text-sm font-semibold text-primary">
                              {applicant.employee?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-base font-semibold text-foreground">
                              {applicant.employee?.name || 'Unknown'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Tier {applicant.employee?.tier || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => onOfferShift(applicant)}
                          className="lovable-btn-primary h-10 px-4 text-sm font-medium"
                          aria-label={`Offer shift to ${applicant.employee?.name || 'Unknown'}`}
                        >
                          Offer Shift
                        </Button>
                      </div>
                    ))}
                    
                    {applicants.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
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
